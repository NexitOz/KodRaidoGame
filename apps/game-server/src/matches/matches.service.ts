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
  PVE_REWARDS,
  type Card,
  type DeckCardEntry,
  type MatchActionResponse,
  type MatchHistoryEntry,
  type MatchStateView,
} from '@kod-raido/shared';
import { toCardDto } from '../cards/cards.service';
import { PrismaService } from '../prisma/prisma.service';
import { BOT_DECKS, pickRandomBotArchetype, type BotArchetype } from './bot-decks';
import { MatchActionDto } from './dto/match-action.dto';
import { MatchStateRepository } from './match-state.repository';
import { buildMatchView } from './view/match-view';

const BOT_PLAYER_ID = 'bot';
const MAX_BOT_ACTIONS_PER_TURN = 40;
const RULES_VERSION = '0.1.0';

@Injectable()
export class MatchesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly repo: MatchStateRepository,
  ) {}

  async createPveMatch(
    userId: string,
    deckId: string,
    difficulty: BotDifficulty,
  ): Promise<MatchStateView> {
    const deck = await this.prisma.deck.findUnique({ where: { id: deckId }, include: { cards: true } });
    if (!deck || deck.userId !== userId) throw new NotFoundException('Deck not found.');

    const playerDeckEntries: DeckCardEntry[] = deck.cards.map((c) => ({
      cardId: c.cardId,
      quantity: c.quantity,
    }));
    const totalPlayerCards = playerDeckEntries.reduce((sum, e) => sum + e.quantity, 0);
    if (totalPlayerCards !== 30) {
      throw new BadRequestException('Deck must contain exactly 30 cards to enter a match.');
    }

    const matchCtx = await this.buildMatchContext();
    const botArchetype = pickRandomBotArchetype();
    const botDeckEntries = this.resolveBotDeck(botArchetype, matchCtx.cards);

    const matchId = randomUUID();
    const seed = randomUUID();

    let state = createMatch({
      matchId,
      seed,
      rulesVersion: RULES_VERSION,
      player1: { playerId: userId, deck: playerDeckEntries },
      player2: { playerId: BOT_PLAYER_ID, deck: botDeckEntries },
      boostSnapshot: [],
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
      },
    });

    if (opening.events.length > 0) {
      await this.repo.appendEvents(matchId, opening.events);
    }

    if (state.finished) {
      await this.finishMatch(userId, matchId, state);
    } else {
      await this.repo.save(matchId, state, userId);
    }

    return buildMatchView(state, matchCtx, userId);
  }

  async getView(userId: string, matchId: string): Promise<MatchStateView> {
    const { state, matchCtx } = await this.loadOwnedMatch(userId, matchId);
    return buildMatchView(state, matchCtx, userId);
  }

  async applyPlayerAction(
    userId: string,
    matchId: string,
    dto: MatchActionDto,
  ): Promise<MatchActionResponse> {
    const { state: loaded, matchCtx } = await this.loadOwnedMatch(userId, matchId);
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
      rewards = await this.finishMatch(userId, matchId, state);
    } else {
      await this.repo.save(matchId, state, userId);
    }

    return {
      view: buildMatchView(state, matchCtx, userId),
      events: allEvents.map((e) => ({ type: e.type, payload: e.payload })),
      rewards,
    };
  }

  async listHistory(userId: string): Promise<MatchHistoryEntry[]> {
    const matches = await this.prisma.match.findMany({
      where: { player1Id: userId },
      orderBy: { startedAt: 'desc' },
      take: 50,
    });

    return matches.map((m) => ({
      id: m.id,
      opponentLabel: m.player2IsBot ? `Бот (${m.botDifficulty ?? 'NORMAL'})` : 'Игрок',
      status: m.status,
      won: m.status === 'FINISHED' ? m.winnerId === userId : null,
      startedAt: m.startedAt.toISOString(),
      finishedAt: m.finishedAt?.toISOString(),
      xpAwarded: m.xpAwarded,
      softCurrencyAwarded: m.softCurrencyAwarded,
    }));
  }

  private async loadOwnedMatch(userId: string, matchId: string): Promise<{ state: MatchState; matchCtx: MatchContext }> {
    const owner = await this.repo.getOwner(matchId);
    if (!owner || owner !== userId) throw new NotFoundException('Match not found or has expired.');

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

  private async finishMatch(
    userId: string,
    matchId: string,
    state: MatchState,
  ): Promise<{ xp: number; softCurrency: number; leveledUp: boolean }> {
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
}
