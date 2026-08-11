import { BadRequestException, NotFoundException } from '@nestjs/common';
import type { GameEvent, MatchState } from '@kod-raido/game-engine';
import { beforeEach, describe, expect, it } from 'vitest';
import { MatchRewardService } from '../progression/match-reward.service';
import { BOT_DECKS } from './bot-decks';
import type { MatchActionDto } from './dto/match-action.dto';
import { MatchesService } from './matches.service';
import { TUTORIAL_DECK } from './tutorial-deck';

interface FakeCardRow {
  id: string;
  slug: string;
  name: string;
  type: string;
  rarity: string;
  cost: number;
  tags: string[];
  attack: number | null;
  health: number | null;
  artworkUrl: string;
  abilityText: string | null;
  effectJson: unknown;
  linkedTrackIds: string[];
  boostProfileId: string | null;
  rightsStatus: string;
  rightsNote: string | null;
  source: string | null;
  licenseExpiresAt: Date | null;
  isPlayable: boolean;
  active: boolean;
  isToken: boolean;
  resonanceTier: number;
  universe: string | null;
  voiceStingerUrl: string | null;
  coverUrl: string | null;
  audioPreviewUrl: string | null;
  releaseUrl: string | null;
  releaseDate: Date | null;
  videoUrl: string | null;
}

function makeCardRow(id: string, overrides: Partial<FakeCardRow> = {}): FakeCardRow {
  return {
    id,
    slug: id,
    name: id,
    type: 'CHARACTER',
    rarity: 'COMMON',
    cost: 2,
    tags: [],
    attack: 2,
    health: 2,
    artworkUrl: '/p.png',
    abilityText: null,
    effectJson: [],
    linkedTrackIds: [],
    boostProfileId: null,
    rightsStatus: 'placeholder',
    rightsNote: null,
    source: null,
    licenseExpiresAt: null,
    isPlayable: true,
    active: true,
    isToken: false,
    resonanceTier: 0,
    universe: null,
    voiceStingerUrl: null,
    coverUrl: null,
    audioPreviewUrl: null,
    releaseUrl: null,
    releaseDate: null,
    videoUrl: null,
    ...overrides,
  };
}

const BOT_CARD_SLUGS = Array.from(
  new Set(Object.values(BOT_DECKS).flatMap((entries) => entries.map((e) => e.slug))),
);
const TUTORIAL_CARD_SLUGS = Array.from(new Set(TUTORIAL_DECK.map((e) => e.slug)));

/** A minimal effectJson whose only purpose is to carry a RESONANCE_TIER_AT_LEAST condition, so
 * `cardUsesResonance()` finds it - the exact same DSL shape any real reactive card uses. */
const RESONANCE_REACTIVE_EFFECT_JSON = [
  {
    trigger: 'ON_PLAY',
    conditions: [{ type: 'RESONANCE_TIER_AT_LEAST', value: 3 }],
    effects: [{ type: 'DRAW', amount: 1 }],
  },
];

/** Arbitrary tutorial-deck slugs used as the default "these happen to carry Resonance DSL in
 * this test run" set - arbitrary on purpose, to prove nothing downstream is keyed to these
 * specific names. */
const DEFAULT_TUTORIAL_RESONANCE_SLUGS = ['ashen-blade', 'presave-signal'];

/**
 * `resonanceReactiveSlugs` marks which tutorial-deck cards carry Resonance-gated DSL in this
 * fake catalog - deliberately a parameter, not a fixed constant, so tests can prove
 * `buildTutorialBoostSnapshot` discovers reactivity from the DSL itself, not from any particular
 * slug.
 */
function buildCardCatalog(resonanceReactiveSlugs: string[] = []): FakeCardRow[] {
  const reactive = new Set(resonanceReactiveSlugs);
  const botCards = BOT_CARD_SLUGS.map((slug, i) => {
    const cost = (i % 4) + 1;
    return makeCardRow(slug, { cost, attack: cost, health: cost + 1 });
  });
  const tutorialCards = TUTORIAL_CARD_SLUGS.map((slug, i) => {
    const cost = (i % 4) + 1;
    return makeCardRow(slug, {
      cost,
      attack: cost,
      health: cost + 1,
      effectJson: reactive.has(slug) ? RESONANCE_REACTIVE_EFFECT_JSON : [],
    });
  });
  const humanCards = Array.from({ length: 15 }, (_, i) =>
    makeCardRow(`human-${i}`, { cost: (i % 4) + 1, attack: 1, health: 1 }),
  );
  return [...botCards, ...tutorialCards, ...humanCards];
}

interface FakeDeck {
  id: string;
  userId: string;
  cards: { cardId: string; quantity: number }[];
}

interface FakeUser {
  id: string;
  username: string;
  xp: number;
  softCurrency: number;
  level: number;
  mmr: number;
  lastFirstWinBonusDate?: string | null;
  highestRewardedLevel?: number | null;
}

interface FakeMatch {
  id: string;
  player1Id: string;
  player2Id: string | null;
  player2IsBot: boolean;
  botDifficulty: string | null;
  isTutorial: boolean;
  seed: string;
  status: string;
  winnerId: string | null;
  boostSnapshotJson: unknown;
  startedAt: Date;
  finishedAt: Date | null;
  xpAwarded: number | null;
  softCurrencyAwarded: number | null;
  player2XpAwarded: number | null;
  player2SoftCurrencyAwarded: number | null;
  player1MmrDelta: number | null;
  player2MmrDelta: number | null;
}

interface FakeMatchReward {
  id: string;
  matchId: string;
  userId: string;
  mode: string;
  result: string;
  xpGranted: number;
  softCurrencyGranted: number;
  firstWinBonus: boolean;
  previousLevel: number;
  newLevel: number;
  economyVersion: string;
  createdAt: Date;
}

function createFakePrisma(cards: FakeCardRow[]) {
  const decks: FakeDeck[] = [];
  const matches: FakeMatch[] = [];
  const users = new Map<string, FakeUser>();
  const matchEvents: unknown[] = [];
  const matchRewards: FakeMatchReward[] = [];
  const userUnlocks: Array<{ userId: string; type: string; key: string; source: string }> = [];

  const api = {
    card: {
      async findMany() {
        return cards;
      },
    },
    deck: {
      async findUnique({ where }: { where: { id: string } }) {
        const deck = decks.find((d) => d.id === where.id);
        return deck ? { id: deck.id, userId: deck.userId, cards: deck.cards } : null;
      },
    },
    match: {
      async create({
        data,
      }: {
        data: Partial<FakeMatch> & Pick<FakeMatch, 'id' | 'player1Id' | 'player2IsBot' | 'seed' | 'status'>;
      }) {
        const row: FakeMatch = {
          player2Id: null,
          botDifficulty: null,
          isTutorial: false,
          boostSnapshotJson: [],
          winnerId: null,
          startedAt: new Date(),
          finishedAt: null,
          xpAwarded: null,
          softCurrencyAwarded: null,
          player2XpAwarded: null,
          player2SoftCurrencyAwarded: null,
          player1MmrDelta: null,
          player2MmrDelta: null,
          ...data,
        };
        matches.push(row);
        return row;
      },
      async findUnique({ where }: { where: { id: string } }) {
        return matches.find((m) => m.id === where.id) ?? null;
      },
      async update({ where, data }: { where: { id: string }; data: Partial<FakeMatch> }) {
        const row = matches.find((m) => m.id === where.id)!;
        Object.assign(row, data);
        return row;
      },
      async findMany({
        where,
        take,
      }: {
        where: { OR: Array<{ player1Id?: string; player2Id?: string }>; isTutorial?: boolean };
        take?: number;
      }) {
        const userId = where.OR.find((clause) => clause.player1Id)?.player1Id ?? '';
        return matches
          .filter((m) => m.player1Id === userId || m.player2Id === userId)
          .filter((m) => where.isTutorial === undefined || m.isTutorial === where.isTutorial)
          .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())
          .slice(0, take ?? matches.length)
          .map((m) => ({
            ...m,
            player1: { username: users.get(m.player1Id)?.username ?? 'Игрок' },
            player2: m.player2Id ? { username: users.get(m.player2Id)?.username ?? 'Игрок' } : null,
          }));
      },
    },
    matchEvent: {
      async createMany({ data }: { data: unknown[] }) {
        matchEvents.push(...data);
        return { count: data.length };
      },
    },
    user: {
      async findUniqueOrThrow({ where }: { where: { id: string } }) {
        const user = users.get(where.id);
        if (!user) throw new Error('user not found');
        return user;
      },
      async update({ where, data }: { where: { id: string }; data: Partial<FakeUser> }) {
        const user = users.get(where.id)!;
        Object.assign(user, data);
        return user;
      },
    },
    matchReward: {
      async create({ data }: { data: Omit<FakeMatchReward, 'id' | 'createdAt'> }) {
        const duplicate = matchRewards.find((r) => r.matchId === data.matchId && r.userId === data.userId);
        if (duplicate) {
          const error = new Error('Unique constraint failed on the fields: (`matchId`,`userId`)') as Error & {
            code: string;
          };
          error.code = 'P2002';
          throw error;
        }
        const row: FakeMatchReward = { id: `reward-${matchRewards.length + 1}`, createdAt: new Date(), ...data };
        matchRewards.push(row);
        return row;
      },
      async findUnique({ where }: { where: { matchId_userId: { matchId: string; userId: string } } }) {
        const { matchId, userId } = where.matchId_userId;
        return matchRewards.find((r) => r.matchId === matchId && r.userId === userId) ?? null;
      },
    },
    userUnlock: {
      async upsert({
        where,
        create,
      }: {
        where: { userId_key: { userId: string; key: string } };
        create: { userId: string; type: string; key: string; source: string };
      }) {
        const existing = userUnlocks.find(
          (u) => u.userId === where.userId_key.userId && u.key === where.userId_key.key,
        );
        if (existing) return existing;
        userUnlocks.push(create);
        return create;
      },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async $transaction<T>(fn: (tx: any) => Promise<T>): Promise<T> {
      return fn(api);
    },
    _internal: { decks, matches, users, matchEvents },
  };

  return api;
}

class FakeMatchStateRepository {
  private states = new Map<string, MatchState>();
  private participants = new Map<string, string[]>();
  private events = new Map<string, GameEvent[]>();

  async save(matchId: string, state: MatchState, participantIds: string[]): Promise<void> {
    this.states.set(matchId, state);
    this.participants.set(matchId, participantIds);
  }

  async load(matchId: string): Promise<MatchState | null> {
    return this.states.get(matchId) ?? null;
  }

  async getParticipants(matchId: string): Promise<string[] | null> {
    return this.participants.get(matchId) ?? null;
  }

  async isParticipant(matchId: string, userId: string): Promise<boolean> {
    const participants = this.participants.get(matchId);
    return participants !== undefined && participants.includes(userId);
  }

  async appendEvents(matchId: string, events: GameEvent[]): Promise<void> {
    if (events.length === 0) return;
    const existing = this.events.get(matchId) ?? [];
    this.events.set(matchId, [...existing, ...events]);
  }

  async loadAllEvents(matchId: string): Promise<GameEvent[]> {
    return this.events.get(matchId) ?? [];
  }

  async delete(matchId: string): Promise<void> {
    this.states.delete(matchId);
    this.participants.delete(matchId);
    this.events.delete(matchId);
  }
}

function endTurn(): MatchActionDto {
  return { type: 'END_TURN' };
}

async function playToFinish(service: MatchesService, userId: string, matchId: string) {
  let result = await service.applyPlayerAction(userId, matchId, endTurn());
  let guard = 0;
  while (!result.view.finished && guard < 100) {
    guard += 1;
    result = await service.applyPlayerAction(userId, matchId, endTurn());
  }
  return result;
}

async function playPvpToFinish(service: MatchesService, matchId: string, player1Id: string) {
  let activePlayerId = (await service.getView(player1Id, matchId)).activePlayerId;
  let result: Awaited<ReturnType<typeof service.applyPvpAction>> | undefined;
  let guard = 0;
  while (guard < 200) {
    guard += 1;
    result = await service.applyPvpAction(activePlayerId, matchId, endTurn());
    if (result.state.finished) break;
    activePlayerId = result.state.activePlayerId;
  }
  if (!result) throw new Error(`playPvpToFinish never took an action for match ${matchId} (guard=${guard})`);
  return result;
}

describe('MatchesService', () => {
  let prisma: ReturnType<typeof createFakePrisma>;
  let repo: FakeMatchStateRepository;
  let service: MatchesService;

  beforeEach(() => {
    const cards = buildCardCatalog(DEFAULT_TUTORIAL_RESONANCE_SLUGS);
    prisma = createFakePrisma(cards);
    repo = new FakeMatchStateRepository();
    prisma._internal.users.set('user-1', {
      id: 'user-1',
      username: 'user-1',
      xp: 0,
      softCurrency: 0,
      level: 1,
      mmr: 1000,
    });
    prisma._internal.decks.push({
      id: 'deck-1',
      userId: 'user-1',
      cards: Array.from({ length: 15 }, (_, i) => ({ cardId: `human-${i}`, quantity: 2 })),
    });
    const fakeResonance = { buildBoostSnapshot: async () => [] };
    const fakeAnalyticsEvents = { log: async () => undefined, logOnce: async () => true };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const matchReward = new MatchRewardService(prisma as any, fakeAnalyticsEvents as any);
    /* eslint-disable @typescript-eslint/no-explicit-any */
    service = new MatchesService(
      prisma as any,
      repo as any,
      fakeResonance as any,
      fakeAnalyticsEvents as any,
      matchReward,
    );
    /* eslint-enable @typescript-eslint/no-explicit-any */
  });

  it('creates a PvE match against a random bot deck for a valid 30-card deck', async () => {
    const view = await service.createPveMatch('user-1', 'deck-1', 'NORMAL');
    expect(view.you.playerId).toBe('user-1');
    expect(view.opponent.isBot).toBe(true);
    expect(view.finished).toBe(false);
  });

  it('rejects a deck that does not total 30 cards', async () => {
    prisma._internal.decks.push({
      id: 'deck-short',
      userId: 'user-1',
      cards: [{ cardId: 'human-0', quantity: 2 }],
    });
    await expect(service.createPveMatch('user-1', 'deck-short', 'NORMAL')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('throws NotFoundException for a deck the user does not own', async () => {
    await expect(service.createPveMatch('user-2', 'deck-1', 'NORMAL')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('redacts the opponent hand from the match view', async () => {
    const view = await service.createPveMatch('user-1', 'deck-1', 'NORMAL');
    expect(view.opponent.hand).toEqual([]);
    expect(view.opponent.handCount).toBeGreaterThan(0);
  });

  it('drives the bot turn automatically and returns control to the human (or finishes)', async () => {
    const view = await service.createPveMatch('user-1', 'deck-1', 'NORMAL');
    const result = await service.applyPlayerAction('user-1', view.matchId, endTurn());
    expect(result.view.finished || result.view.activePlayerId === 'user-1').toBe(true);
  });

  it('rejects actions from a user who does not own the match', async () => {
    const view = await service.createPveMatch('user-1', 'deck-1', 'NORMAL');
    await expect(
      service.applyPlayerAction('user-2', view.matchId, endTurn()),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('rejects an illegal action', async () => {
    const view = await service.createPveMatch('user-1', 'deck-1', 'NORMAL');
    await expect(
      service.applyPlayerAction('user-1', view.matchId, {
        type: 'PLAY_CARD',
        cardId: 'not-in-hand',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('finishes the match, awards rewards, updates user xp, and clears the redis state', async () => {
    const view = await service.createPveMatch('user-1', 'deck-1', 'NORMAL');
    const result = await playToFinish(service, 'user-1', view.matchId);

    expect(result.view.finished).toBe(true);
    expect(result.rewards).toBeDefined();
    expect(result.rewards!.xp).toBeGreaterThan(0);

    const user = prisma._internal.users.get('user-1')!;
    expect(user.xp).toBe(result.rewards!.xp);
    expect(await repo.getParticipants(view.matchId)).toBeNull();
  });

  it('lists match history with the finished result after a match ends', async () => {
    const view = await service.createPveMatch('user-1', 'deck-1', 'NORMAL');
    await playToFinish(service, 'user-1', view.matchId);

    const history = await service.listHistory('user-1');
    expect(history).toHaveLength(1);
    expect(history[0]!.status).toBe('FINISHED');
    expect(typeof history[0]!.won).toBe('boolean');
  });

  describe('PvP matches', () => {
    const PLAYER1 = 'user-1';
    const PLAYER2 = 'user-2';

    beforeEach(() => {
      prisma._internal.users.set(PLAYER2, {
        id: PLAYER2,
        username: 'user-2',
        xp: 0,
        softCurrency: 0,
        level: 1,
        mmr: 1000,
      });
      prisma._internal.decks.push({
        id: 'deck-2',
        userId: PLAYER2,
        cards: Array.from({ length: 15 }, (_, i) => ({ cardId: `human-${i}`, quantity: 2 })),
      });
    });

    it('creates a PvP match for two valid decks and lets both participants view it', async () => {
      const { matchId } = await service.createPvpMatch(
        { userId: PLAYER1, deckId: 'deck-1' },
        { userId: PLAYER2, deckId: 'deck-2' },
      );
      const view1 = await service.getView(PLAYER1, matchId);
      const view2 = await service.getView(PLAYER2, matchId);

      expect(view1.you.playerId).toBe(PLAYER1);
      expect(view1.opponent.playerId).toBe(PLAYER2);
      expect(view2.you.playerId).toBe(PLAYER2);
      expect(view2.opponent.playerId).toBe(PLAYER1);
      expect(view1.finished).toBe(false);
    });

    it('rejects a PvP match when either deck is invalid', async () => {
      await expect(
        service.createPvpMatch({ userId: PLAYER1, deckId: 'deck-1' }, { userId: PLAYER2, deckId: 'nope' }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('rejects an action from a non-participant', async () => {
      const { matchId } = await service.createPvpMatch(
        { userId: PLAYER1, deckId: 'deck-1' },
        { userId: PLAYER2, deckId: 'deck-2' },
      );
      await expect(
        service.applyPvpAction('some-other-user', matchId, endTurn()),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('rejects an action taken out of turn', async () => {
      const { matchId } = await service.createPvpMatch(
        { userId: PLAYER1, deckId: 'deck-1' },
        { userId: PLAYER2, deckId: 'deck-2' },
      );
      const view = await service.getView(PLAYER1, matchId);
      const notActive = view.activePlayerId === PLAYER1 ? PLAYER2 : PLAYER1;
      await expect(service.applyPvpAction(notActive, matchId, endTurn())).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it('plays a full match to completion with symmetric MMR deltas and clears redis state', async () => {
      const { matchId } = await service.createPvpMatch(
        { userId: PLAYER1, deckId: 'deck-1' },
        { userId: PLAYER2, deckId: 'deck-2' },
      );
      const result = await playPvpToFinish(service, matchId, PLAYER1);

      expect(result.state.finished).toBe(true);
      const rewards = result.rewardsByPlayer!;
      const winnerId = result.state.winnerId!;
      const loserId = winnerId === PLAYER1 ? PLAYER2 : PLAYER1;

      expect(rewards[winnerId]!.mmrDelta).toBeGreaterThan(0);
      expect(rewards[loserId]!.mmrDelta).toBeLessThan(0);
      // Both players start at the same 1000 mmr, so the Elo swing must be exactly symmetric.
      expect(rewards[winnerId]!.mmrDelta).toBe(-rewards[loserId]!.mmrDelta!);

      const winnerUser = prisma._internal.users.get(winnerId)!;
      const loserUser = prisma._internal.users.get(loserId)!;
      expect(winnerUser.mmr).toBe(1000 + rewards[winnerId]!.mmrDelta!);
      expect(loserUser.mmr).toBe(1000 + rewards[loserId]!.mmrDelta!);

      expect(await repo.getParticipants(matchId)).toBeNull();
    });

    it('forfeits the match in favor of the other participant when one disconnects', async () => {
      const { matchId } = await service.createPvpMatch(
        { userId: PLAYER1, deckId: 'deck-1' },
        { userId: PLAYER2, deckId: 'deck-2' },
      );
      const result = await service.forfeitPvpMatch(matchId, PLAYER1);

      expect(result).not.toBeNull();
      expect(result!.state.winnerId).toBe(PLAYER2);
      expect(result!.rewardsByPlayer[PLAYER2]!.mmrDelta).toBeGreaterThan(0);
      expect(result!.rewardsByPlayer[PLAYER1]!.mmrDelta).toBeLessThan(0);
      expect(await repo.getParticipants(matchId)).toBeNull();
    });

    it('returns null when forfeiting a match that is already finished', async () => {
      const { matchId } = await service.createPvpMatch(
        { userId: PLAYER1, deckId: 'deck-1' },
        { userId: PLAYER2, deckId: 'deck-2' },
      );
      await playPvpToFinish(service, matchId, PLAYER1);
      expect(await service.forfeitPvpMatch(matchId, PLAYER1)).toBeNull();
    });

    it('records PvP results in both participants match history with the correct perspective', async () => {
      const { matchId } = await service.createPvpMatch(
        { userId: PLAYER1, deckId: 'deck-1' },
        { userId: PLAYER2, deckId: 'deck-2' },
      );
      const result = await playPvpToFinish(service, matchId, PLAYER1);
      const winnerId = result.state.winnerId!;

      const history1 = await service.listHistory(PLAYER1);
      const history2 = await service.listHistory(PLAYER2);

      expect(history1).toHaveLength(1);
      expect(history2).toHaveLength(1);
      expect(history1[0]!.won).toBe(winnerId === PLAYER1);
      expect(history2[0]!.won).toBe(winnerId === PLAYER2);
      expect(history1[0]!.opponentLabel).toBe('user-2');
      expect(history2[0]!.opponentLabel).toBe('user-1');
      expect(history1[0]!.mmrDelta).toBeDefined();
      expect(history2[0]!.mmrDelta).toBeDefined();
    });
  });

  describe('createTutorialMatch', () => {
    it('creates a match flagged isTutorial and playable through the normal action pipeline', async () => {
      const view = await service.createTutorialMatch('user-1');
      expect(view.you.playerId).toBe('user-1');
      expect(view.opponent.isBot).toBe(true);

      const stored = prisma._internal.matches.find((m) => m.id === view.matchId)!;
      expect(stored.isTutorial).toBe(true);
      expect(stored.botDifficulty).toBe('TUTORIAL');
    });

    it('grants a synthetic Resonance Tier 3 boost only to the deck\'s own Resonance-reactive cards, not real ResonanceSnapshot data', async () => {
      const view = await service.createTutorialMatch('user-1');
      const stored = prisma._internal.matches.find((m) => m.id === view.matchId)!;
      const boostSnapshot = stored.boostSnapshotJson as Array<{ cardId: string; tier: number }>;

      // Discovered generically from this test's fake catalog (DEFAULT_TUTORIAL_RESONANCE_SLUGS
      // carry RESONANCE_TIER_AT_LEAST DSL) - not from a hardcoded slug list in production code.
      expect(boostSnapshot.length).toBe(DEFAULT_TUTORIAL_RESONANCE_SLUGS.length);
      expect(boostSnapshot.every((entry) => entry.tier === 3)).toBe(true);
    });

    it('discovers a Resonance-reactive tutorial card by its DSL alone, regardless of its slug/id', async () => {
      // A fresh catalog where a completely different (arbitrary) tutorial-deck card carries the
      // Resonance DSL - proves boost discovery isn't tied to any specific slug.
      const altSlug = 'scouting-of-the-court';
      const altCards = buildCardCatalog([altSlug]);
      const altPrisma = createFakePrisma(altCards);
      altPrisma._internal.users.set('user-1', {
        id: 'user-1',
        username: 'user-1',
        xp: 0,
        softCurrency: 0,
        level: 1,
        mmr: 1000,
      });
      const fakeResonance = { buildBoostSnapshot: async () => [] };
      const fakeAnalyticsEvents = { log: async () => undefined, logOnce: async () => true };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const altMatchReward = new MatchRewardService(altPrisma as any, fakeAnalyticsEvents as any);
      /* eslint-disable @typescript-eslint/no-explicit-any */
      const altService = new MatchesService(
        altPrisma as any,
        repo as any,
        fakeResonance as any,
        fakeAnalyticsEvents as any,
        altMatchReward,
      );
      /* eslint-enable @typescript-eslint/no-explicit-any */

      const view = await altService.createTutorialMatch('user-1');
      const stored = altPrisma._internal.matches.find((m) => m.id === view.matchId)!;
      const boostSnapshot = stored.boostSnapshotJson as Array<{ cardId: string; tier: number }>;
      const altCardId = altCards.find((c) => c.slug === altSlug)!.id;

      expect(boostSnapshot).toEqual([{ cardId: altCardId, tier: 3, boostPercent: 6 }]);
    });

    it('excludes tutorial matches from normal match history', async () => {
      await service.createTutorialMatch('user-1');
      const history = await service.listHistory('user-1');
      expect(history).toHaveLength(0);
    });

    it('finishing a tutorial match never grants the normal PvE XP/soft-currency reward', async () => {
      const view = await service.createTutorialMatch('user-1');
      const before = prisma._internal.users.get('user-1')!;
      const beforeXp = before.xp;
      const beforeCurrency = before.softCurrency;

      const result = await playToFinish(service, 'user-1', view.matchId);
      expect(result.view.finished).toBe(true);
      expect(result.rewards).toBeUndefined();

      const after = prisma._internal.users.get('user-1')!;
      expect(after.xp).toBe(beforeXp);
      expect(after.softCurrency).toBe(beforeCurrency);
    });
  });
});
