import { beforeEach, describe, expect, it } from 'vitest';
import { TutorialService } from './tutorial.service';

interface FakeUserRow {
  id: string;
  xp: number;
  softCurrency: number;
  level: number;
  tutorialStartedAt: Date | null;
  tutorialCompletedAt: Date | null;
  tutorialSkippedAt: Date | null;
  tutorialCurrentStep: number | null;
  tutorialRewardClaimedAt: Date | null;
}

interface FakeMatchRow {
  id: string;
  player1Id: string;
  isTutorial: boolean;
  status: 'ACTIVE' | 'FINISHED';
  winnerId: string | null;
  startedAt: Date;
  finishedAt: Date | null;
}

interface FakePrisma {
  _internal: { users: Map<string, FakeUserRow>; matches: FakeMatchRow[] };
  user: {
    findUniqueOrThrow(args: { where: { id: string } }): Promise<FakeUserRow>;
    update(args: { where: { id: string }; data: Partial<FakeUserRow> }): Promise<FakeUserRow>;
  };
  match: {
    findFirst(args: {
      where: Record<string, unknown>;
      orderBy?: { startedAt?: 'desc'; finishedAt?: 'desc' };
    }): Promise<FakeMatchRow | null>;
  };
  $transaction<T>(fn: (tx: FakePrisma) => Promise<T>): Promise<T>;
}

function createFakePrisma(): FakePrisma {
  const users = new Map<string, FakeUserRow>();
  const matches: FakeMatchRow[] = [];

  return {
    _internal: { users, matches },
    user: {
      async findUniqueOrThrow({ where }) {
        const row = users.get(where.id);
        if (!row) throw new Error('not found');
        return row;
      },
      async update({ where, data }) {
        const row = users.get(where.id)!;
        Object.assign(row, data);
        return row;
      },
    },
    match: {
      async findFirst({ where, orderBy }) {
        const candidates = matches.filter((m) =>
          Object.entries(where).every(
            ([key, value]) => (m as unknown as Record<string, unknown>)[key] === value,
          ),
        );
        if (candidates.length === 0) return null;
        if (orderBy?.finishedAt === 'desc') {
          return [...candidates].sort(
            (a, b) => (b.finishedAt?.getTime() ?? 0) - (a.finishedAt?.getTime() ?? 0),
          )[0]!;
        }
        return [...candidates].sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())[0]!;
      },
    },
    async $transaction<T>(fn: (tx: FakePrisma) => Promise<T>): Promise<T> {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      return fn(fakePrismaSelf);
    },
  };
}

let fakePrismaSelf: FakePrisma;

function createFakeAnalyticsEvents() {
  const events: Array<{ type: string; userId?: string; payload?: Record<string, unknown> }> = [];
  return {
    events,
    async log(type: string, userId: string | undefined, payload: Record<string, unknown> = {}) {
      events.push({ type, userId, payload });
    },
    async logOnce(type: string, userId: string) {
      events.push({ type, userId });
      return true;
    },
  };
}

describe('TutorialService', () => {
  let prisma: ReturnType<typeof createFakePrisma>;
  let analyticsEvents: ReturnType<typeof createFakeAnalyticsEvents>;
  let matches: { createTutorialMatch: (userId: string) => Promise<{ matchId: string }> };
  let service: TutorialService;

  beforeEach(() => {
    prisma = createFakePrisma();
    fakePrismaSelf = prisma;
    prisma._internal.users.set('user-1', {
      id: 'user-1',
      xp: 0,
      softCurrency: 0,
      level: 1,
      tutorialStartedAt: null,
      tutorialCompletedAt: null,
      tutorialSkippedAt: null,
      tutorialCurrentStep: null,
      tutorialRewardClaimedAt: null,
    });
    analyticsEvents = createFakeAnalyticsEvents();
    matches = { createTutorialMatch: async () => ({ matchId: 'match-1' }) };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    service = new TutorialService(prisma as any, matches as any, analyticsEvents as any);
  });

  it('getProgress reflects a fresh user with no tutorial activity', async () => {
    const progress = await service.getProgress('user-1');
    expect(progress).toMatchObject({
      startedAt: undefined,
      completedAt: undefined,
      skippedAt: undefined,
      currentStep: null,
      rewardClaimed: false,
    });
  });

  it('start creates a tutorial match and marks tutorialStartedAt', async () => {
    const result = await service.start('user-1');
    expect(result.matchId).toBe('match-1');
    expect(prisma._internal.users.get('user-1')!.tutorialStartedAt).toBeInstanceOf(Date);
    expect(analyticsEvents.events).toContainEqual({
      type: 'tutorialStarted',
      userId: 'user-1',
      payload: {},
    });
  });

  it('saveStep persists the client-driven step bookmark', async () => {
    const progress = await service.saveStep('user-1', 4);
    expect(progress.currentStep).toBe(4);
    expect(analyticsEvents.events).toContainEqual({
      type: 'tutorialStepReached',
      userId: 'user-1',
      payload: { step: 4 },
    });
  });

  it('skip marks tutorialSkippedAt without granting any reward', async () => {
    const progress = await service.skip('user-1');
    expect(progress.skippedAt).toBeTruthy();
    expect(progress.rewardClaimed).toBe(false);
  });

  it('complete rejects when there is no finished, won tutorial match', async () => {
    await expect(service.complete('user-1')).rejects.toThrow();
  });

  it('complete rejects a finished tutorial match the player lost', async () => {
    prisma._internal.matches.push({
      id: 'm1',
      player1Id: 'user-1',
      isTutorial: true,
      status: 'FINISHED',
      winnerId: 'bot',
      startedAt: new Date(),
      finishedAt: new Date(),
    });
    await expect(service.complete('user-1')).rejects.toThrow();
  });

  it('complete grants the reward exactly once, even across repeated calls (replay)', async () => {
    prisma._internal.matches.push({
      id: 'm1',
      player1Id: 'user-1',
      isTutorial: true,
      status: 'FINISHED',
      winnerId: 'user-1',
      startedAt: new Date(),
      finishedAt: new Date(),
    });

    const first = await service.complete('user-1');
    expect(first.rewardGranted).toBe(true);
    expect(first.xp).toBeGreaterThan(0);
    expect(first.softCurrency).toBeGreaterThan(0);

    const userAfterFirst = prisma._internal.users.get('user-1')!;
    expect(userAfterFirst.tutorialRewardClaimedAt).toBeInstanceOf(Date);
    const xpAfterFirst = userAfterFirst.xp;

    // Replay: a second finished+won tutorial match, reward must not be granted again.
    prisma._internal.matches.push({
      id: 'm2',
      player1Id: 'user-1',
      isTutorial: true,
      status: 'FINISHED',
      winnerId: 'user-1',
      startedAt: new Date(),
      finishedAt: new Date(Date.now() + 1000),
    });
    const second = await service.complete('user-1');
    expect(second.rewardGranted).toBe(false);
    expect(second.xp).toBe(0);
    expect(second.softCurrency).toBe(0);
    expect(prisma._internal.users.get('user-1')!.xp).toBe(xpAfterFirst);
  });

  it('skip does not permanently block the reward - completing afterwards still grants it once', async () => {
    await service.skip('user-1');
    prisma._internal.matches.push({
      id: 'm1',
      player1Id: 'user-1',
      isTutorial: true,
      status: 'FINISHED',
      winnerId: 'user-1',
      startedAt: new Date(),
      finishedAt: new Date(),
    });
    const result = await service.complete('user-1');
    expect(result.rewardGranted).toBe(true);
  });
});
