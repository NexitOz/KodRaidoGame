import { randomUUID } from 'node:crypto';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
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
  cardUsesResonance,
  computeMmrDelta,
  type BoostSnapshotEntry,
  type Card,
  type DeckCardEntry,
  type MatchActionResponse,
  type MatchHistoryEntry,
  type MatchRewards,
  type MatchResult,
  type MatchStateView,
} from '@kod-raido/shared';
import { AnalyticsEventsService } from '../analytics-events/analytics-events.service';
import { toCardDto } from '../cards/cards.service';
import { PrismaService } from '../prisma/prisma.service';
import { MatchRewardResult, MatchRewardService } from '../progression/match-reward.service';
import { ResonanceService } from '../resonance/resonance.service';
import { BOT_DECKS, pickRandomBotArchetype, type BotArchetype } from './bot-decks';
import { MatchActionDto } from './dto/match-action.dto';
import { MatchStateRepository } from './match-state.repository';
import { TUTORIAL_BOT_ARCHETYPE, TUTORIAL_DECK, TUTORIAL_MATCH_SEED } from './tutorial-deck';
import { buildMatchView } from './view/match-view';

const BOT_PLAYER_ID = 'bot';
const MAX_BOT_ACTIONS_PER_TURN = 40;
const RULES_VERSION = '0.1.0';
/** Synthetic Resonance tier granted only inside the tutorial match - never written to ResonanceSnapshot. */
const TUTORIAL_RESONANCE_TIER = 3;
const TUTORIAL_RESONANCE_BOOST_PERCENT = 6;

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
    private readonly analyticsEvents: AnalyticsEventsService,
    private readonly matchReward: MatchRewardService,
  ) {}

  async createPveMatch(
    userId: string,
    deckId: string,
    difficulty: BotDifficulty,
  ): Promise<MatchStateView> {
    // PRACTICE is a deterministic no-op bot for automated e2e/integration tests only (see
    // pve-bot.ts) - hard-rejected in production regardless of what a client sends, so it can
    // never change what a real player experiences or be used to farm rewards for free.
    if (difficulty === 'PRACTICE' && process.env.NODE_ENV === 'production') {
      throw new ForbiddenException('PRACTICE difficulty is not available in production.');
    }

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

    await this.analyticsEvents.logOnce('firstPvEStarted', userId);

    return buildMatchView(state, matchCtx, userId);
  }

  /**
   * First Player Experience 1.0: creates a PvE match against the gentle TUTORIAL
   * bot, using a fixed 30-card deck (existing Content Pack 01 cards only) and a
   * fixed deterministic seed so the opening draws are reproducible for every
   * player. Goes through the exact same createMatch/beginMatch/applyAction
   * pipeline as a normal PvE match - no separate pseudo-engine.
   */
  async createTutorialMatch(userId: string): Promise<MatchStateView> {
    const matchCtx = await this.buildMatchContext();
    const playerDeckEntries = this.resolveDeckBySlug(TUTORIAL_DECK, matchCtx.cards);
    const botDeckEntries = this.resolveBotDeck(TUTORIAL_BOT_ARCHETYPE, matchCtx.cards);
    const boostSnapshot = this.buildTutorialBoostSnapshot(playerDeckEntries, matchCtx.cards);

    const matchId = randomUUID();

    let state = createMatch({
      matchId,
      seed: TUTORIAL_MATCH_SEED,
      rulesVersion: RULES_VERSION,
      player1: { playerId: userId, deck: playerDeckEntries },
      player2: { playerId: BOT_PLAYER_ID, deck: botDeckEntries },
      boostSnapshot,
    });
    state = beginMatch(state, matchCtx).state;
    const opening = this.driveBotTurns(state, matchCtx, 'TUTORIAL');
    state = opening.state;

    await this.prisma.match.create({
      data: {
        id: matchId,
        player1Id: userId,
        player2IsBot: true,
        botDifficulty: 'TUTORIAL',
        isTutorial: true,
        seed: TUTORIAL_MATCH_SEED,
        status: 'ACTIVE',
        boostSnapshotJson: boostSnapshot as object,
      },
    });

    if (opening.events.length > 0) {
      await this.repo.appendEvents(matchId, opening.events);
    }

    if (state.finished) {
      await this.finishTutorialMatch(matchId, state);
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
      rewards = dbMatch?.isTutorial
        ? await this.finishTutorialMatch(matchId, state)
        : await this.finishPveMatch(userId, matchId, state);
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
      where: { OR: [{ player1Id: userId }, { player2Id: userId }], isTutorial: false },
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
    return this.resolveDeckBySlug(BOT_DECKS[archetype], cardsById);
  }

  private resolveDeckBySlug(
    entries: Array<{ slug: string; quantity: number }>,
    cardsById: Map<string, Card>,
  ): DeckCardEntry[] {
    const idBySlug = new Map<string, string>();
    for (const card of cardsById.values()) idBySlug.set(card.slug, card.id);

    return entries
      .map((entry) => {
        const cardId = idBySlug.get(entry.slug);
        return cardId ? { cardId, quantity: entry.quantity } : null;
      })
      .filter((entry): entry is DeckCardEntry => entry !== null);
  }

  /**
   * Synthetic, match-scoped Resonance boost for the tutorial deck's own
   * Resonance-reactive cards. Deliberately bypasses ResonanceService
   * entirely - real ResonanceSnapshot rows are never written, so this never
   * affects any other match.
   *
   * Which cards get the boost is discovered generically: every card actually
   * in the resolved tutorial deck is checked via `cardUsesResonance()` (a
   * pure DSL scan for a `RESONANCE_TIER_AT_LEAST` condition) - never a
   * hardcoded slug/id list. Swapping any card in `TUTORIAL_DECK` for another
   * Resonance-reactive Content Pack 01 card keeps working with no code
   * change here.
   */
  private buildTutorialBoostSnapshot(
    deckEntries: DeckCardEntry[],
    cardsById: Map<string, Card>,
  ): BoostSnapshotEntry[] {
    const seenCardIds = new Set<string>();
    const boosts: BoostSnapshotEntry[] = [];

    for (const entry of deckEntries) {
      if (seenCardIds.has(entry.cardId)) continue;
      const card = cardsById.get(entry.cardId);
      if (!card || !cardUsesResonance(card)) continue;
      seenCardIds.add(entry.cardId);
      boosts.push({
        cardId: card.id,
        tier: TUTORIAL_RESONANCE_TIER,
        boostPercent: TUTORIAL_RESONANCE_BOOST_PERCENT,
      });
    }

    return boosts;
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
    const events = await this.repo.loadAllEvents(matchId);

    if (events.length > 0) {
      await this.prisma.matchEvent.createMany({
        data: events.map((event, index) => ({
          matchId,
          sequence: index,
          type: event.type,
          payloadJson: event.payload as object,
        })),
      });
    }

    // Player Progression & Economy 1.0: XP/soft-currency are granted by MatchRewardService, which
    // is itself atomic and idempotent (keyed on matchId+userId) - the match row is only marked
    // FINISHED afterwards, so a retry of this whole method after a mid-way crash re-derives the
    // same already-granted reward instead of paying twice.
    const reward = await this.matchReward.grantMatchReward({
      userId,
      matchId,
      mode: 'PVE',
      result: won ? 'WIN' : 'LOSS',
    });

    await this.prisma.match.update({
      where: { id: matchId },
      data: {
        status: 'FINISHED',
        winnerId: state.winnerId ?? null,
        finishedAt: new Date(),
        xpAwarded: reward.xpGranted,
        softCurrencyAwarded: reward.softCurrencyGranted,
      },
    });

    await this.repo.delete(matchId);
    await this.analyticsEvents.logOnce('firstPvEFinished', userId);

    return this.toMatchRewards(reward);
  }

  private toMatchRewards(reward: MatchRewardResult, mmrDelta?: number, newMmr?: number): MatchRewards {
    return {
      xp: reward.xpGranted,
      softCurrency: reward.softCurrencyGranted,
      leveledUp: reward.levelsGained > 0,
      firstWinBonus: reward.firstWinBonus,
      previousLevel: reward.previousLevel,
      newLevel: reward.newLevel,
      rewardsUnlocked: reward.rewardsUnlocked,
      currentLevelXp: reward.currentLevelXp,
      nextLevelXp: reward.nextLevelXp,
      progressPercent: reward.progressPercent,
      ...(mmrDelta !== undefined ? { mmrDelta, newMmr } : {}),
    };
  }

  /**
   * Tutorial matches never touch user.xp/softCurrency here - the one-time
   * completion reward is granted separately and exactly once by
   * TutorialService.complete(), which verifies this exact row first.
   */
  private async finishTutorialMatch(matchId: string, state: MatchState): Promise<undefined> {
    const events = await this.repo.loadAllEvents(matchId);

    if (events.length > 0) {
      await this.prisma.matchEvent.createMany({
        data: events.map((event, index) => ({
          matchId,
          sequence: index,
          type: event.type,
          payloadJson: event.payload as object,
        })),
      });
    }

    await this.prisma.match.update({
      where: { id: matchId },
      data: { status: 'FINISHED', winnerId: state.winnerId ?? null, finishedAt: new Date() },
    });

    await this.repo.delete(matchId);
    return undefined;
  }

  private async finishPvpMatch(
    matchId: string,
    state: MatchState,
    player1Id: string,
    player2Id: string,
  ): Promise<Record<string, MatchRewards>> {
    const events = await this.repo.loadAllEvents(matchId);
    if (events.length > 0) {
      await this.prisma.matchEvent.createMany({
        data: events.map((event, index) => ({
          matchId,
          sequence: index,
          type: event.type,
          payloadJson: event.payload as object,
        })),
      });
    }

    const isDraw = !state.winnerId;
    const player1Won = state.winnerId === player1Id;
    const result1: MatchResult = isDraw ? 'DRAW' : player1Won ? 'WIN' : 'LOSS';
    const result2: MatchResult = isDraw ? 'DRAW' : player1Won ? 'LOSS' : 'WIN';

    // Player Progression & Economy 1.0: the current PvP queue is MMR-rated - there is no separate
    // casual queue yet - so it is scored as RANKED_PVP. Each call is its own atomic,
    // idempotent grant keyed on (matchId, userId); running them concurrently is safe since they
    // touch different user rows and never contend for the same MatchReward unique key.
    const [reward1, reward2] = await Promise.all([
      this.matchReward.grantMatchReward({ userId: player1Id, matchId, mode: 'RANKED_PVP', result: result1 }),
      this.matchReward.grantMatchReward({ userId: player2Id, matchId, mode: 'RANKED_PVP', result: result2 }),
    ]);

    // MMR is a separate, PvP-only rating concern from XP/currency - computed fresh here from the
    // pre-match mmr values, independent of MatchRewardService (which never touches mmr).
    const [delta1, delta2, newMmr1, newMmr2] = await this.prisma.$transaction(async (tx) => {
      const [user1, user2] = await Promise.all([
        tx.user.findUniqueOrThrow({ where: { id: player1Id } }),
        tx.user.findUniqueOrThrow({ where: { id: player2Id } }),
      ]);

      const d1 = computeMmrDelta(user1.mmr, user2.mmr, result1);
      const d2 = computeMmrDelta(user2.mmr, user1.mmr, result2);

      await Promise.all([
        tx.user.update({ where: { id: player1Id }, data: { mmr: user1.mmr + d1 } }),
        tx.user.update({ where: { id: player2Id }, data: { mmr: user2.mmr + d2 } }),
      ]);

      return [d1, d2, user1.mmr + d1, user2.mmr + d2];
    });

    await this.prisma.match.update({
      where: { id: matchId },
      data: {
        status: 'FINISHED',
        winnerId: state.winnerId ?? null,
        finishedAt: new Date(),
        xpAwarded: reward1.xpGranted,
        softCurrencyAwarded: reward1.softCurrencyGranted,
        player2XpAwarded: reward2.xpGranted,
        player2SoftCurrencyAwarded: reward2.softCurrencyGranted,
        player1MmrDelta: delta1,
        player2MmrDelta: delta2,
      },
    });

    await this.repo.delete(matchId);

    return {
      [player1Id]: this.toMatchRewards(reward1, delta1, newMmr1),
      [player2Id]: this.toMatchRewards(reward2, delta2, newMmr2),
    };
  }
}
