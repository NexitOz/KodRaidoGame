import { beforeEach, describe, expect, it } from 'vitest';
import { AnalyticsService } from './analytics.service';

interface FakeUser {
  id: string;
  createdAt: Date;
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

function createFakePrisma() {
  const users: FakeUser[] = [];
  const matches: FakeMatch[] = [];
  const matchEvents: FakeMatchEvent[] = [];
  const cards: FakeCard[] = [];

  return {
    user: {
      async count({ where }: { where?: { createdAt?: { gte: Date } } } = {}) {
        if (!where?.createdAt) return users.length;
        return users.filter((u) => u.createdAt >= where.createdAt!.gte).length;
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
    _internal: { users, matches, matchEvents, cards },
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
});
