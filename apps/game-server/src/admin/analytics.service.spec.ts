import { beforeEach, describe, expect, it } from 'vitest';
import { AnalyticsService } from './analytics.service';

interface FakeUser {
  id: string;
  createdAt: Date;
  tutorialStartedAt?: Date | null;
  tutorialCompletedAt?: Date | null;
  tutorialSkippedAt?: Date | null;
}

interface FakeAnalyticsEvent {
  type: string;
  userId?: string;
  payloadJson: unknown;
}

interface FakeMatch {
  id: string;
  status: string;
  player2IsBot: boolean;
  startedAt: Date;
}

interface FakeMatchEvent {
  type: string;
  payloadJson: unknown;
}

interface FakeCard {
  id: string;
  name: string;
}

interface FakeMatchReward {
  id: string;
  userId: string;
  matchId: string;
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

function createFakePrisma() {
  const users: FakeUser[] = [];
  const matches: FakeMatch[] = [];
  const matchEvents: FakeMatchEvent[] = [];
  const cards: FakeCard[] = [];
  const analyticsEvents: FakeAnalyticsEvent[] = [];
  const matchRewards: FakeMatchReward[] = [];
  const usersById = new Map<string, { username: string; level: number; xp: number; softCurrency: number }>();

  return {
    user: {
      async count({ where }: { where?: { createdAt?: { gte: Date } } } = {}) {
        if (!where?.createdAt) return users.length;
        return users.filter((u) => u.createdAt >= where.createdAt!.gte).length;
      },
      async findMany({ select: _select }: { select: unknown }) {
        return users.map((u) => ({
          id: u.id,
          tutorialStartedAt: u.tutorialStartedAt ?? null,
          tutorialCompletedAt: u.tutorialCompletedAt ?? null,
          tutorialSkippedAt: u.tutorialSkippedAt ?? null,
        }));
      },
    },
    match: {
      async findMany({ select: _select }: { select: unknown }) {
        return matches.map((m) => ({ status: m.status, player2IsBot: m.player2IsBot, startedAt: m.startedAt }));
      },
    },
    matchEvent: {
      async findMany({ where }: { where: { type: string } }) {
        return matchEvents
          .filter((e) => e.type === where.type)
          .map((e) => ({ payloadJson: e.payloadJson }));
      },
    },
    card: {
      async findMany({ where }: { where: { id: { in: string[] } } }) {
        return cards
          .filter((c) => where.id.in.includes(c.id))
          .map((c) => ({ id: c.id, name: c.name }));
      },
    },
    analyticsEvent: {
      async findMany({ where }: { where: { type: string } }) {
        return analyticsEvents
          .filter((e) => e.type === where.type)
          .map((e) => ({ userId: e.userId, payloadJson: e.payloadJson }));
      },
    },
    matchReward: {
      async findMany({
        take,
      }: {
        orderBy: { createdAt: 'desc' };
        take: number;
        include: { user: { select: unknown } };
      }) {
        return [...matchRewards]
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          .slice(0, take)
          .map((r) => ({ ...r, user: usersById.get(r.userId)! }));
      },
    },
    _internal: { users, matches, matchEvents, cards, analyticsEvents, matchRewards, usersById },
  };
}

describe('AnalyticsService', () => {
  let prisma: ReturnType<typeof createFakePrisma>;
  let service: AnalyticsService;
  const now = new Date('2026-01-15T00:00:00Z');

  beforeEach(() => {
    prisma = createFakePrisma();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    service = new AnalyticsService(prisma as any);
  });

  it('counts total users and users registered in the last 7 days', async () => {
    prisma._internal.users.push(
      { id: 'u1', createdAt: new Date('2026-01-14T00:00:00Z') },
      { id: 'u2', createdAt: new Date('2025-12-01T00:00:00Z') },
    );

    const summary = await service.getSummary(now);
    expect(summary.totalUsers).toBe(2);
    expect(summary.newUsersLast7Days).toBe(1);
  });

  it('splits finished matches into pve/pvp and ignores non-finished ones for the mode breakdown', async () => {
    prisma._internal.matches.push(
      { id: 'm1', status: 'FINISHED', player2IsBot: true, startedAt: now },
      { id: 'm2', status: 'FINISHED', player2IsBot: false, startedAt: now },
      { id: 'm3', status: 'ACTIVE', player2IsBot: true, startedAt: now },
    );

    const summary = await service.getSummary(now);
    expect(summary.totalMatches).toBe(3);
    expect(summary.finishedMatches).toBe(2);
    expect(summary.matchesByMode).toEqual({ pve: 1, pvp: 1 });
  });

  it('counts matches started in the last 7 days regardless of status', async () => {
    prisma._internal.matches.push(
      { id: 'm1', status: 'ACTIVE', player2IsBot: true, startedAt: new Date('2026-01-14T00:00:00Z') },
      { id: 'm2', status: 'FINISHED', player2IsBot: true, startedAt: new Date('2025-11-01T00:00:00Z') },
    );

    const summary = await service.getSummary(now);
    expect(summary.matchesLast7Days).toBe(1);
  });

  it('ranks top played cards by CARD_PLAYED event frequency and resolves names', async () => {
    prisma._internal.cards.push({ id: 'card-1', name: 'Каэль' }, { id: 'card-2', name: 'Векс' });
    prisma._internal.matchEvents.push(
      { type: 'CARD_PLAYED', payloadJson: { cardId: 'card-1' } },
      { type: 'CARD_PLAYED', payloadJson: { cardId: 'card-1' } },
      { type: 'CARD_PLAYED', payloadJson: { cardId: 'card-2' } },
      { type: 'TURN_END', payloadJson: {} },
    );

    const summary = await service.getSummary(now);
    expect(summary.topCards).toEqual([
      { cardId: 'card-1', name: 'Каэль', timesPlayed: 2 },
      { cardId: 'card-2', name: 'Векс', timesPlayed: 1 },
    ]);
  });

  it('returns an empty topCards list when nothing has been played', async () => {
    const summary = await service.getSummary(now);
    expect(summary.topCards).toEqual([]);
  });

  it('falls back to "Unknown card" if a played card was since deleted', async () => {
    prisma._internal.matchEvents.push({ type: 'CARD_PLAYED', payloadJson: { cardId: 'ghost-card' } });
    const summary = await service.getSummary(now);
    expect(summary.topCards).toEqual([{ cardId: 'ghost-card', name: 'Unknown card', timesPlayed: 1 }]);
  });

  it('counts tutorial started/completed/skipped users and derives a completion rate', async () => {
    prisma._internal.users.push(
      { id: 'u1', createdAt: now, tutorialStartedAt: now, tutorialCompletedAt: now },
      { id: 'u2', createdAt: now, tutorialStartedAt: now, tutorialSkippedAt: now },
      { id: 'u3', createdAt: now, tutorialStartedAt: now },
      { id: 'u4', createdAt: now },
    );

    const summary = await service.getSummary(now);
    expect(summary.tutorialStartedUsers).toBe(3);
    expect(summary.tutorialCompletedUsers).toBe(1);
    expect(summary.tutorialSkippedUsers).toBe(1);
    expect(summary.completionRate).toBeCloseTo(1 / 3);
  });

  it('returns a completion rate of 0 when nobody has started the tutorial', async () => {
    prisma._internal.users.push({ id: 'u1', createdAt: now });
    const summary = await service.getSummary(now);
    expect(summary.completionRate).toBe(0);
  });

  it('buckets drop-off by the furthest step reached, only for users who neither completed nor skipped', async () => {
    prisma._internal.users.push(
      { id: 'stuck-early', createdAt: now, tutorialStartedAt: now },
      { id: 'stuck-later', createdAt: now, tutorialStartedAt: now },
      { id: 'finished', createdAt: now, tutorialStartedAt: now, tutorialCompletedAt: now },
      { id: 'never-started', createdAt: now },
    );
    prisma._internal.analyticsEvents.push(
      { type: 'tutorialStepReached', userId: 'stuck-later', payloadJson: { step: 1 } },
      { type: 'tutorialStepReached', userId: 'stuck-later', payloadJson: { step: 4 } },
      { type: 'tutorialStepReached', userId: 'finished', payloadJson: { step: 8 } },
    );

    const summary = await service.getSummary(now);
    expect(summary.dropOffByStep).toEqual({ 0: 1, 4: 1 });
  });

  it('counts users who completed or skipped the tutorial and then started a PvE match', async () => {
    prisma._internal.users.push(
      { id: 'completed-and-played', createdAt: now, tutorialStartedAt: now, tutorialCompletedAt: now },
      { id: 'skipped-and-played', createdAt: now, tutorialStartedAt: now, tutorialSkippedAt: now },
      { id: 'completed-but-idle', createdAt: now, tutorialStartedAt: now, tutorialCompletedAt: now },
      { id: 'still-in-tutorial', createdAt: now, tutorialStartedAt: now },
    );
    prisma._internal.analyticsEvents.push(
      { type: 'firstPvEStarted', userId: 'completed-and-played', payloadJson: {} },
      { type: 'firstPvEStarted', userId: 'skipped-and-played', payloadJson: {} },
      { type: 'firstPvEStarted', userId: 'still-in-tutorial', payloadJson: {} },
    );

    const summary = await service.getSummary(now);
    expect(summary.firstPvEAfterTutorial).toBe(2);
  });
});

describe('AnalyticsService.getRecentMatchRewards', () => {
  let prisma: ReturnType<typeof createFakePrisma>;
  let service: AnalyticsService;

  beforeEach(() => {
    prisma = createFakePrisma();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    service = new AnalyticsService(prisma as any);
  });

  it('returns the most recent rewards newest-first, with the granting user context attached', async () => {
    prisma._internal.usersById.set('u1', { username: 'rider', level: 3, xp: 250, softCurrency: 900 });
    prisma._internal.matchRewards.push(
      {
        id: 'r1',
        userId: 'u1',
        matchId: 'm1',
        mode: 'PVE',
        result: 'WIN',
        xpGranted: 60,
        softCurrencyGranted: 25,
        firstWinBonus: false,
        previousLevel: 2,
        newLevel: 3,
        economyVersion: '1',
        createdAt: new Date('2026-01-01T00:00:00Z'),
      },
      {
        id: 'r2',
        userId: 'u1',
        matchId: 'm2',
        mode: 'PVE',
        result: 'WIN',
        xpGranted: 110,
        softCurrencyGranted: 75,
        firstWinBonus: true,
        previousLevel: 3,
        newLevel: 3,
        economyVersion: '1',
        createdAt: new Date('2026-01-02T00:00:00Z'),
      },
    );

    const rows = await service.getRecentMatchRewards();
    expect(rows).toHaveLength(2);
    expect(rows[0]!.id).toBe('r2'); // newest first
    expect(rows[0]!.username).toBe('rider');
    expect(rows[0]!.level).toBe(3);
    expect(rows[0]!.xp).toBe(250);
    expect(rows[0]!.softCurrency).toBe(900);
    expect(rows[0]!.firstWinBonus).toBe(true);
  });

  it('respects the limit parameter', async () => {
    prisma._internal.usersById.set('u1', { username: 'rider', level: 1, xp: 0, softCurrency: 500 });
    for (let i = 0; i < 5; i += 1) {
      prisma._internal.matchRewards.push({
        id: `r${i}`,
        userId: 'u1',
        matchId: `m${i}`,
        mode: 'PVE',
        result: 'WIN',
        xpGranted: 60,
        softCurrencyGranted: 25,
        firstWinBonus: false,
        previousLevel: 1,
        newLevel: 1,
        economyVersion: '1',
        createdAt: new Date(2026, 0, 1 + i),
      });
    }
    const rows = await service.getRecentMatchRewards(2);
    expect(rows).toHaveLength(2);
  });
});
