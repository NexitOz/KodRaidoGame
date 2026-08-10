import { randomUUID } from 'node:crypto';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  applyAction,
  beginMatch,
  chooseBotAction,
  createMatch,
  type BotDifficulty,
  type GameAction,
  type GameEvent,
  type MatchContext,
  type MatchState,
} from '@kod-raido/game-engine';
import {
  computeLevelForXp,
  computeMmrDelta,
  PVE_REWARDS,
  PVP_REWARDS,
  type Card,
  type DeckCardEntry,
  type MatchActionResponse,
  type MatchHistoryEntry,
  type MatchRewards,
  type MatchResult,
  type MatchStateView,
} from '@kod-raido/shared';
import { toCardDto } from '../cards/cards.service';
import { PrismaService } from '../prisma/prisma.service';
import { ResonanceService } from '../resonance/resonance.service';
import { BOT_DECKS, pickRandomBotArchetype, type BotArchetype } from './bot-decks';
import { MatchActionDto } from './dto/match-action.dto';
import { MatchStateRepository } from './match-state.repository';
import { buildMatchView } from './view/match-view';

const BOT_PLAYER_ID = 'bot';
const MAX_BOT_ACTIONS_PER_TURN = 40;
const RULES_VERSION = '0.1.0';

export interface PvpActionResult {
  state: MatchState;
  matchCtx: MatchContext;
  events: GameEvent[];
  rewardsByPlayer?: Record<string, MatchRewards>;
}

export interface PvpDeckInput {
  userId: string;
  deckId: string;
}

@Injectable()
export class MatchesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly repo: MatchStateRepository,
    private readonly resonance: ResonanceService,
  ) {}

  async createPveMatch(
    userId: string,
    deckId: string,
    difficulty: BotDifficulty,
  ): Promise<MatchStateView> {
    const playerDeckEntries = await this.loadValidatedDeck(userId, deckId);

    const matchCtx = await this.buildMatchContext();
    const botArchetype = pickRandomBotArchetype();
    const botDeckEntries = this.resolveBotDeck(botArchetype, matchCtx.cards);
    const boostSnapshot = await this.resonance.buildBoostSnapshot();

    const matchId = randomUUID();
    const seed = randomUUID();

    let state = createMatch({
      matchId,
      seed,
      rulesVersion: RULES_VERSION,
      player1: { playerId: userId, deck: playerDeckEntries },
      player2: { playerId: BOT_PLAYER_ID, deck: botDeckEntries },
      boostSnapshot,
    });
    state = beginMatch(state, matchCtx).state;
    const opening = this.driveBotTurns(state, matchCtx, difficulty);
    state = opening.state;

    await this.prisma.match.create({
      data: {
        id: matchId,
        player1Id: userId,
        player2IsBot: true,
        botDifficulty: difficulty,
        seed,
        status: 'ACTIVE',
        boostSnapshotJson: boostSnapshot as object,
      },
    });

    if (opening.events.length > 0) {
      await this.repo.appendEvents(matchId, opening.events);
    }

    if (state.finished) {
      await this.finishPveMatch(userId, matchId, state);
    } else {
      await this.repo.save(matchId, state, [userId]);
    }

    return buildMatchView(state, matchCtx, userId);
  }

  /** Fails fast with a clear error before a player sits in the matchmaking queue with an unusable deck. */
  async assertDeckReady(userId: string, deckId: string): Promise<void> {
    await this.loadValidatedDeck(userId, deckId);
  }

  /** Called by matchmaking once two queued players are paired; returns just the matchId — each player fetches their own redacted view via `getView` after joining the match room. */
  async createPvpMatch(player1: PvpDeckInput, player2: PvpDeckInput): Promise<{ matchId: string }> {
    const [entries1, entries2] = await Promise.all([
      this.loadValidatedDeck(player1.userId, player1.deckId, 'Колода игрока 1'),
      this.loadValidatedDeck(player2.userId, player2.deckId, 'Колода игрока 2'),
    ]);

    const matchCtx = await this.buildMatchContext();
    const boostSnapshot = await this.resonance.buildBoostSnapshot();
    const matchId = randomUUID();
    const seed = randomUUID();

    let state = createMatch({
      matchId,
      seed,
      rulesVersion: RULES_VERSION,
      player1: { playerId: player1.userId, deck: entries1 },
      player2: { playerId: player2.userId, deck: entries2 },
      boostSnapshot,
    });
    state = beginMatch(state, matchCtx).state;

    await this.prisma.match.create({
      data: {
        id: matchId,
        player1Id: player1.userId,
        player2Id: player2.userId,
        player2IsBot: false,
        seed,
        status: 'ACTIVE',
        boostSnapshotJson: boostSnapshot as object,
      },
    });

    await this.repo.save(matchId, state, [player1.userId, player2.userId]);

    return { matchId };
  }

  async getView(userId: string, matchId: string): Promise<MatchStateView> {
    const { state, matchCtx } = await this.loadParticipantMatch(userId, matchId);
    return buildMatchView(state, matchCtx, userId);
  }

  async applyPlayerAction(
    userId: string,
    matchId: string,
    dto: MatchActionDto,
  ): Promise<MatchActionResponse> {
    const { state: loaded, matchCtx } = await this.loadParticipantMatch(userId, matchId);
    if (loaded.finished) throw new BadRequestException('Match already finished.');

    const dbMatch = await this.prisma.match.findUnique({ where: { id: matchId } });
    const difficulty = (dbMatch?.botDifficulty ?? 'NORMAL') as BotDifficulty;

    const action = this.toGameAction(userId, dto);
    const result = applyAction(loaded, action, matchCtx);
    if (!result.valid) {
      throw new BadRequestException(result.error ?? 'Illegal action.');
    }

    const driven = this.driveBotTurns(result.state, matchCtx, difficulty);
    const state = driven.state;
    const allEvents = [...result.events, ...driven.events];

    await this.repo.appendEvents(matchId, allEvents);

    let rewards: MatchActionResponse['rewards'];
    if (state.finished) {
      rewards = await this.finishPveMatch(userId, matchId, state);
    } else {
      await this.repo.save(matchId, state, [userId]);
    }

    return {
      view: buildMatchView(state, matchCtx, userId),
      events: allEvents.map((e) => ({ type: e.type, payload: e.payload })),
      rewards,
    };
  }

  /** PvP action: no bot to auto-drive — the other human takes their own turn via their own call. */
  async applyPvpAction(userId: string, matchId: string, dto: MatchActionDto): Promise<PvpActionResult> {
    const { state: loaded, matchCtx } = await this.loadParticipantMatch(userId, matchId);
    if (loaded.finished) throw new BadRequestException('Match already finished.');

    const dbMatch = await this.prisma.match.findUnique({ where: { id: matchId } });
    if (!dbMatch || !dbMatch.player2Id) throw new NotFoundException('PvP match not found.');

    const action = this.toGameAction(userId, dto);
    const result = applyAction(loaded, action, matchCtx);
    if (!result.valid) {
      throw new BadRequestException(result.error ?? 'Illegal action.');
    }

    const state = result.state;
    await this.repo.appendEvents(matchId, result.events);

    let rewardsByPlayer: Record<string, MatchRewards> | undefined;
    if (state.finished) {
      rewardsByPlayer = await this.finishPvpMatch(matchId, state, dbMatch.player1Id, dbMatch.player2Id);
    } else {
      await this.repo.save(matchId, state, [dbMatch.player1Id, dbMatch.player2Id]);
    }

    return { state, matchCtx, events: result.events, rewardsByPlayer };
  }

  /** Called when a PvP participant fails to reconnect within the gateway's grace period. */
  async forfeitPvpMatch(
    matchId: string,
    forfeitingUserId: string,
  ): Promise<{ state: MatchState; matchCtx: MatchContext; rewardsByPlayer: Record<string, MatchRewards> } | null> {
    const dbMatch = await this.prisma.match.findUnique({ where: { id: matchId } });
    if (!dbMatch || dbMatch.status !== 'ACTIVE' || !dbMatch.player2Id) return null;

    const loaded = await this.repo.load(matchId);
    if (!loaded || loaded.finished) return null;

    const winnerId = dbMatch.player1Id === forfeitingUserId ? dbMatch.player2Id : dbMatch.player1Id;
    const state: MatchState = { ...loaded, finished: true, winnerId };
    const matchCtx = await this.buildMatchContext();

    const rewardsByPlayer = await this.finishPvpMatch(matchId, state, dbMatch.player1Id, dbMatch.player2Id);
    return { state, matchCtx, rewardsByPlayer };
  }

  async listHistory(userId: string): Promise<MatchHistoryEntry[]> {
    const matches = await this.prisma.match.findMany({
      where: { OR: [{ player1Id: userId }, { player2Id: userId }] },
      orderBy: { startedAt: 'desc' },
      take: 50,
      include: {
        player1: { select: { username: true } },
        player2: { select: { username: true } },
      },
    });

    return matches.map((m) => {
      const isPlayer1 = m.player1Id === userId;
      const opponentLabel = m.player2IsBot
        ? `Бот (${m.botDifficulty ?? 'NORMAL'})`
        : (isPlayer1 ? m.player2?.username : m.player1.username) ?? 'Игрок';

      return {
        id: m.id,
        opponentLabel,
        status: m.status,
        won: m.status === 'FINISHED' ? m.winnerId === userId : null,
        startedAt: m.startedAt.toISOString(),
        finishedAt: m.finishedAt?.toISOString(),
        xpAwarded: isPlayer1 ? m.xpAwarded : (m.player2XpAwarded ?? 0),
        softCurrencyAwarded: isPlayer1 ? m.softCurrencyAwarded : (m.player2SoftCurrencyAwarded ?? 0),
        mmrDelta: (isPlayer1 ? m.player1MmrDelta : m.player2MmrDelta) ?? undefined,
      };
    });
  }

  private async loadParticipantMatch(
    userId: string,
    matchId: string,
  ): Promise<{ state: MatchState; matchCtx: MatchContext }> {
    const isParticipant = await this.repo.isParticipant(matchId, userId);
    if (!isParticipant) throw new NotFoundException('Match not found or has expired.');

    const state = await this.repo.load(matchId);
    if (!state) throw new NotFoundException('Match not found or has expired.');

    const matchCtx = await this.buildMatchContext();
    return { state, matchCtx };
  }

  private driveBotTurns(
    state: MatchState,
    matchCtx: MatchContext,
    difficulty: BotDifficulty,
  ): { state: MatchState; events: GameEvent[] } {
    const events: GameEvent[] = [];
    let current = state;

    let guard = 0;
    while (!current.finished && current.activePlayerId === BOT_PLAYER_ID && guard < MAX_BOT_ACTIONS_PER_TURN) {
      guard += 1;
      const botAction = chooseBotAction(current, matchCtx, BOT_PLAYER_ID, difficulty);
      const botResult = applyAction(current, botAction, matchCtx);
      if (!botResult.valid) break; // defensive: the bot should never produce an illegal move
      current = botResult.state;
      events.push(...botResult.events);
    }

    return { state: current, events };
  }

  private async buildMatchContext(): Promise<MatchContext> {
    const cards = await this.prisma.card.findMany();
    return { rulesVersion: RULES_VERSION, cards: new Map(cards.map((c) => [c.id, toCardDto(c)])) };
  }

  private async loadValidatedDeck(
    userId: string,
    deckId: string,
    label = 'Колода',
  ): Promise<DeckCardEntry[]> {
    const deck = await this.prisma.deck.findUnique({ where: { id: deckId }, include: { cards: true } });
    if (!deck || deck.userId !== userId) throw new NotFoundException(`${label} не найдена.`);

    const entries: DeckCardEntry[] = deck.cards.map((c) => ({ cardId: c.cardId, quantity: c.quantity }));
    const total = entries.reduce((sum, e) => sum + e.quantity, 0);
    if (total !== 30) {
      throw new BadRequestException(`${label} должна содержать ровно 30 карт, чтобы начать матч.`);
    }
    return entries;
  }

  private resolveBotDeck(archetype: BotArchetype, cardsById: Map<string, Card>): DeckCardEntry[] {
    const idBySlug = new Map<string, string>();
    for (const card of cardsById.values()) idBySlug.set(card.slug, card.id);

    return BOT_DECKS[archetype]
      .map((entry) => {
        const cardId = idBySlug.get(entry.slug);
        return cardId ? { cardId, quantity: entry.quantity } : null;
      })
      .filter((entry): entry is DeckCardEntry => entry !== null);
  }

  private toGameAction(userId: string, dto: MatchActionDto): GameAction {
    switch (dto.type) {
      case 'PLAY_CARD':
        if (!dto.cardId) throw new BadRequestException('cardId is required for PLAY_CARD.');
        return { type: 'PLAY_CARD', playerId: userId, cardId: dto.cardId, targetId: dto.targetId };
      case 'ATTACK':
        if (!dto.attackerId || !dto.targetId) {
          throw new BadRequestException('attackerId and targetId are required for ATTACK.');
        }
        return { type: 'ATTACK', playerId: userId, attackerId: dto.attackerId, targetId: dto.targetId };
      case 'END_TURN':
        return { type: 'END_TURN', playerId: userId };
      default:
        throw new BadRequestException('Unknown action type.');
    }
  }

  private async finishPveMatch(
    userId: string,
    matchId: string,
    state: MatchState,
  ): Promise<MatchRewards> {
    const won = state.winnerId === userId;
    const reward = won ? PVE_REWARDS.win : PVE_REWARDS.loss;
    const events = await this.repo.loadAllEvents(matchId);

    const leveledUp = await this.prisma.$transaction(async (tx) => {
      if (events.length > 0) {
        await tx.matchEvent.createMany({
          data: events.map((event, index) => ({
            matchId,
            sequence: index,
            type: event.type,
            payloadJson: event.payload as object,
          })),
        });
      }

      await tx.match.update({
        where: { id: matchId },
        data: {
          status: 'FINISHED',
          winnerId: state.winnerId ?? null,
          finishedAt: new Date(),
          xpAwarded: reward.xp,
          softCurrencyAwarded: reward.softCurrency,
        },
      });

      const user = await tx.user.findUniqueOrThrow({ where: { id: userId } });
      const newXp = user.xp + reward.xp;
      const oldLevel = computeLevelForXp(user.xp);
      const newLevel = computeLevelForXp(newXp);
      await tx.user.update({
        where: { id: userId },
        data: { xp: newXp, softCurrency: user.softCurrency + reward.softCurrency, level: newLevel },
      });

      return newLevel > oldLevel;
    });

    await this.repo.delete(matchId);

    return { xp: reward.xp, softCurrency: reward.softCurrency, leveledUp };
  }

  private async finishPvpMatch(
    matchId: string,
    state: MatchState,
    player1Id: string,
    player2Id: string,
  ): Promise<Record<string, MatchRewards>> {
    const events = await this.repo.loadAllEvents(matchId);
    const isDraw = !state.winnerId;
    const player1Won = state.winnerId === player1Id;
    const result1: MatchResult = isDraw ? 'DRAW' : player1Won ? 'WIN' : 'LOSS';
    const result2: MatchResult = isDraw ? 'DRAW' : player1Won ? 'LOSS' : 'WIN';
    const rewardFor = (result: MatchResult) =>
      result === 'WIN' ? PVP_REWARDS.win : result === 'LOSS' ? PVP_REWARDS.loss : PVP_REWARDS.draw;
    const reward1 = rewardFor(result1);
    const reward2 = rewardFor(result2);

    const rewardsByPlayer = await this.prisma.$transaction(async (tx) => {
      if (events.length > 0) {
        await tx.matchEvent.createMany({
          data: events.map((event, index) => ({
            matchId,
            sequence: index,
            type: event.type,
            payloadJson: event.payload as object,
          })),
        });
      }

      const [user1, user2] = await Promise.all([
        tx.user.findUniqueOrThrow({ where: { id: player1Id } }),
        tx.user.findUniqueOrThrow({ where: { id: player2Id } }),
      ]);

      const delta1 = computeMmrDelta(user1.mmr, user2.mmr, result1);
      const delta2 = computeMmrDelta(user2.mmr, user1.mmr, result2);

      await tx.match.update({
        where: { id: matchId },
        data: {
          status: 'FINISHED',
          winnerId: state.winnerId ?? null,
          finishedAt: new Date(),
          xpAwarded: reward1.xp,
          softCurrencyAwarded: reward1.softCurrency,
          player2XpAwarded: reward2.xp,
          player2SoftCurrencyAwarded: reward2.softCurrency,
          player1MmrDelta: delta1,
          player2MmrDelta: delta2,
        },
      });

      const newXp1 = user1.xp + reward1.xp;
      const oldLevel1 = computeLevelForXp(user1.xp);
      const newLevel1 = computeLevelForXp(newXp1);
      const newMmr1 = user1.mmr + delta1;

      const newXp2 = user2.xp + reward2.xp;
      const oldLevel2 = computeLevelForXp(user2.xp);
      const newLevel2 = computeLevelForXp(newXp2);
      const newMmr2 = user2.mmr + delta2;

      await Promise.all([
        tx.user.update({
          where: { id: player1Id },
          data: {
            xp: newXp1,
            softCurrency: user1.softCurrency + reward1.softCurrency,
            level: newLevel1,
            mmr: newMmr1,
          },
        }),
        tx.user.update({
          where: { id: player2Id },
          data: {
            xp: newXp2,
            softCurrency: user2.softCurrency + reward2.softCurrency,
            level: newLevel2,
            mmr: newMmr2,
          },
        }),
      ]);

      return {
        [player1Id]: {
          xp: reward1.xp,
          softCurrency: reward1.softCurrency,
          leveledUp: newLevel1 > oldLevel1,
          mmrDelta: delta1,
          newMmr: newMmr1,
        },
        [player2Id]: {
          xp: reward2.xp,
          softCurrency: reward2.softCurrency,
          leveledUp: newLevel2 > oldLevel2,
          mmrDelta: delta2,
          newMmr: newMmr2,
        },
      };
    });

    await this.repo.delete(matchId);

    return rewardsByPlayer;
  }
}
