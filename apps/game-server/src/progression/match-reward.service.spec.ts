import { Prisma } from '@prisma/client';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  ECONOMY_VERSION,
  FIRST_WIN_OF_DAY_BONUS,
  LEVEL_REWARDS,
  levelForXp,
  REWARD_TABLE,
  xpRequiredForLevel,
} from '@kod-raido/shared';
import { MatchRewardService } from './match-reward.service';

interface FakeUser {
  id: string;
  xp: number;
  softCurrency: number;
  level: number;
  lastFirstWinBonusDate: string | null;
  highestRewardedLevel: number | null;
}

interface FakeMatchRewardRow {
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

function createFakePrisma() {
  const users = new Map<string, FakeUser>();
  const matchRewards: FakeMatchRewardRow[] = [];
  const userUnlocks: Array<{ userId: string; type: string; key: string; source: string }> = [];
  let rewardIdCounter = 0;
  // Per-user promise-chain "mutex" keyed by userId, simulating Postgres's row-level lock
  // (`SELECT ... FOR UPDATE`) for these fake-prisma tests: a $queryRaw call for a given userId
  // only resolves once every earlier holder for that same userId has released (i.e. its
  // enclosing $transaction callback has settled). Different userIds never block each other.
  const userLockQueues = new Map<string, Promise<void>>();

  function ensureUser(id: string): FakeUser {
    if (!users.has(id)) {
      users.set(id, {
        id,
        xp: 0,
        softCurrency: 0,
        level: 1,
        lastFirstWinBonusDate: null,
        highestRewardedLevel: null,
      });
    }
    return users.get(id)!;
  }

  const base = {
    user: {
      async findUniqueOrThrow({ where }: { where: { id: string } }) {
        return ensureUser(where.id);
      },
      async update({ where, data }: { where: { id: string }; data: Partial<FakeUser> }) {
        const user = ensureUser(where.id);
        Object.assign(user, data);
        return user;
      },
    },
    matchReward: {
      // Mirrors the real unique constraint on (matchId, userId): a synchronous check-then-push
      // with no `await` in between, so two "concurrent" callers under Promise.all can never both
      // see zero duplicates - the same reasoning already proven for StarterDeckProvisioningService.
      async create({ data }: { data: Omit<FakeMatchRewardRow, 'id' | 'createdAt'> }) {
        const duplicate = matchRewards.find((r) => r.matchId === data.matchId && r.userId === data.userId);
        if (duplicate) {
          throw new Prisma.PrismaClientKnownRequestError(
            'Unique constraint failed on the fields: (`matchId`,`userId`)',
            { code: 'P2002', clientVersion: 'test', meta: { target: ['matchId', 'userId'] } },
          );
        }
        rewardIdCounter += 1;
        const row: FakeMatchRewardRow = { id: `reward-${rewardIdCounter}`, createdAt: new Date(), ...data };
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
  };

  return {
    ...base,
    async $transaction<T>(
      cb: (
        tx: typeof base & {
          $queryRaw: (strings: TemplateStringsArray, ...values: unknown[]) => Promise<unknown>;
        },
      ) => Promise<T>,
    ): Promise<T> {
      const holder: { release: (() => void) | null } = { release: null };
      const tx = {
        ...base,
        async $queryRaw(_strings: TemplateStringsArray, ...values: unknown[]) {
          const userId = String(values[0]);
          const previous = userLockQueues.get(userId) ?? Promise.resolve();
          let releaseThis!: () => void;
          const gate = new Promise<void>((resolve) => {
            releaseThis = resolve;
          });
          userLockQueues.set(
            userId,
            previous.then(() => gate),
          );
          await previous;
          holder.release = releaseThis;
          return [{ id: userId }];
        },
      };
      try {
        return await cb(tx);
      } finally {
        holder.release?.();
      }
    },
    getUser: (id: string) => users.get(id),
    setUser: (id: string, patch: Partial<FakeUser>) => Object.assign(ensureUser(id), patch),
    rewardsFor: (userId: string) => matchRewards.filter((r) => r.userId === userId),
    unlocksFor: (userId: string) => userUnlocks.filter((u) => u.userId === userId),
  };
}

function createFakeAnalytics() {
  const events: Array<{ type: string; userId?: string; payload: Record<string, unknown> }> = [];
  return {
    events,
    async log(type: string, userId: string | undefined, payload: Record<string, unknown> = {}) {
      events.push({ type, userId, payload });
    },
  };
}

describe('MatchRewardService', () => {
  let prisma: ReturnType<typeof createFakePrisma>;
  let analytics: ReturnType<typeof createFakeAnalytics>;
  let service: MatchRewardService;

  const TODAY = new Date().toISOString().slice(0, 10);

  beforeEach(() => {
    prisma = createFakePrisma();
    analytics = createFakeAnalytics();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    service = new MatchRewardService(prisma as any, analytics as any);
  });

  it('A: PvE victory grants exactly REWARD_TABLE.PVE.WIN xp/echo (daily bonus pre-claimed to isolate)', async () => {
    prisma.setUser('user-1', { lastFirstWinBonusDate: TODAY });
    const result = await service.grantMatchReward({ userId: 'user-1', matchId: 'm1', mode: 'PVE', result: 'WIN' });
    expect(result.granted).toBe(true);
    expect(result.firstWinBonus).toBe(false);
    expect(result.xpGranted).toBe(REWARD_TABLE.PVE.WIN.xp);
    expect(result.softCurrencyGranted).toBe(REWARD_TABLE.PVE.WIN.softCurrency);
    expect(prisma.getUser('user-1')!.xp).toBe(REWARD_TABLE.PVE.WIN.xp);
  });

  it('B: PvE defeat grants exactly REWARD_TABLE.PVE.LOSS xp/echo', async () => {
    prisma.setUser('user-2', { lastFirstWinBonusDate: TODAY });
    const result = await service.grantMatchReward({ userId: 'user-2', matchId: 'm2', mode: 'PVE', result: 'LOSS' });
    expect(result.xpGranted).toBe(REWARD_TABLE.PVE.LOSS.xp);
    expect(result.softCurrencyGranted).toBe(REWARD_TABLE.PVE.LOSS.softCurrency);
  });

  it('C: granting the same match reward twice is a no-op the second time', async () => {
    const first = await service.grantMatchReward({ userId: 'user-3', matchId: 'm3', mode: 'PVE', result: 'WIN' });
    const second = await service.grantMatchReward({ userId: 'user-3', matchId: 'm3', mode: 'PVE', result: 'WIN' });
    expect(first.granted).toBe(true);
    expect(second.granted).toBe(false);
    expect(second.xpGranted).toBe(first.xpGranted);
    // xp was only ever added once, not twice.
    expect(prisma.getUser('user-3')!.xp).toBe(first.xpGranted);
    expect(prisma.rewardsFor('user-3')).toHaveLength(1);
  });

  it('D: two concurrent reward calls for the same match resolve to exactly one grant', async () => {
    const [a, b] = await Promise.all([
      service.grantMatchReward({ userId: 'user-4', matchId: 'm4', mode: 'PVE', result: 'WIN' }),
      service.grantMatchReward({ userId: 'user-4', matchId: 'm4', mode: 'PVE', result: 'WIN' }),
    ]);
    const grantedCount = [a, b].filter((r) => r.granted).length;
    expect(grantedCount).toBe(1);
    expect(prisma.rewardsFor('user-4')).toHaveLength(1);
    expect(prisma.getUser('user-4')!.xp).toBe(REWARD_TABLE.PVE.WIN.xp + 50); // + first-win bonus, granted once
  });

  it('E: the first win of the day grants the first-win bonus exactly once', async () => {
    const result = await service.grantMatchReward({ userId: 'user-5', matchId: 'm5', mode: 'PVE', result: 'WIN' });
    expect(result.firstWinBonus).toBe(true);
    expect(result.xpGranted).toBe(REWARD_TABLE.PVE.WIN.xp + 50);
    expect(result.softCurrencyGranted).toBe(REWARD_TABLE.PVE.WIN.softCurrency + 50);
  });

  it('F: a second win the same UTC day does not repeat the daily bonus', async () => {
    await service.grantMatchReward({ userId: 'user-6', matchId: 'm6a', mode: 'PVE', result: 'WIN' });
    const second = await service.grantMatchReward({ userId: 'user-6', matchId: 'm6b', mode: 'PVE', result: 'WIN' });
    expect(second.firstWinBonus).toBe(false);
    expect(second.xpGranted).toBe(REWARD_TABLE.PVE.WIN.xp);
  });

  it('G: the daily bonus is available again on the next UTC day', async () => {
    prisma.setUser('user-7', { lastFirstWinBonusDate: '2020-01-01' });
    const result = await service.grantMatchReward({ userId: 'user-7', matchId: 'm7', mode: 'PVE', result: 'WIN' });
    expect(result.firstWinBonus).toBe(true);
  });

  it('H: crossing a level threshold updates the account level', async () => {
    prisma.setUser('user-8', { xp: xpRequiredForLevel(2) - 5, lastFirstWinBonusDate: TODAY }); // level 1, 5xp short of level 2
    const result = await service.grantMatchReward({ userId: 'user-8', matchId: 'm8', mode: 'PVE', result: 'WIN' });
    expect(result.previousLevel).toBe(1);
    expect(result.newLevel).toBe(2);
    expect(result.levelsGained).toBe(1);
    expect(prisma.getUser('user-8')!.level).toBe(2);
  });

  it('I: crossing multiple level thresholds in one match unlocks every reward in between', async () => {
    // 90xp (level 1) + a first-win RANKED_PVP victory (110 + 50 bonus = 160) = 250xp -> level 3.
    prisma.setUser('user-9', { xp: 90 });
    const result = await service.grantMatchReward({
      userId: 'user-9',
      matchId: 'm9',
      mode: 'RANKED_PVP',
      result: 'WIN',
    });
    expect(result.previousLevel).toBe(1);
    expect(result.newLevel).toBe(3);
    const levels = result.rewardsUnlocked.map((r) => r.level);
    expect(levels).toEqual([2, 3]);
    expect(result.rewardsUnlocked[0]).toMatchObject(LEVEL_REWARDS[2]!);
    expect(result.rewardsUnlocked[1]).toMatchObject(LEVEL_REWARDS[3]!);
  });

  it('J: account level progression never touches combat-related fields (fake has none, and the service never fails looking for them)', async () => {
    // The fake user/prisma object exposes only xp/softCurrency/level/lastFirstWinBonusDate/
    // highestRewardedLevel, and this fake prisma exposes no card/deck tables at all - if
    // MatchRewardService ever tried to read or grant combat power, this call would throw.
    const result = await service.grantMatchReward({ userId: 'user-10', matchId: 'm10', mode: 'PVE', result: 'WIN' });
    expect(result.granted).toBe(true);
    expect(Object.keys(prisma.getUser('user-10')!).sort()).toEqual(
      ['xp', 'softCurrency', 'level', 'lastFirstWinBonusDate', 'highestRewardedLevel', 'id'].sort(),
    );
  });

  it('K: a refresh/retry of the same match+user never grants a duplicate reward', async () => {
    const original = await service.grantMatchReward({ userId: 'user-11', matchId: 'm11', mode: 'PVE', result: 'WIN' });
    for (let i = 0; i < 3; i += 1) {
      const retry = await service.grantMatchReward({ userId: 'user-11', matchId: 'm11', mode: 'PVE', result: 'WIN' });
      expect(retry.granted).toBe(false);
      expect(retry.xpGranted).toBe(original.xpGranted);
    }
    expect(prisma.getUser('user-11')!.xp).toBe(original.xpGranted);
  });

  it('L: the persisted reward record carries the current economy version', async () => {
    await service.grantMatchReward({ userId: 'user-12', matchId: 'm12', mode: 'PVE', result: 'WIN' });
    const rows = prisma.rewardsFor('user-12');
    expect(rows).toHaveLength(1);
    expect(rows[0]!.economyVersion).toBe(ECONOMY_VERSION);
  });

  it('does not retroactively reward levels an existing user already reached before this system (lazy bootstrap)', async () => {
    // Simulates a pre-existing user already at level 5 (highestRewardedLevel never set).
    prisma.setUser('user-13', { xp: xpRequiredForLevel(5), lastFirstWinBonusDate: TODAY });
    const result = await service.grantMatchReward({
      userId: 'user-13',
      matchId: 'm13',
      mode: 'PVE',
      result: 'WIN',
    });
    // Still level 5 after a small PvE win reward - no level crossed, so nothing should unlock,
    // and no reward for levels 2-5 (already passed before this system ever ran) is granted.
    expect(result.rewardsUnlocked).toEqual([]);
    expect(prisma.getUser('user-13')!.highestRewardedLevel).toBe(5);
  });

  it('draw is treated as a loss for reward purposes', async () => {
    const result = await service.grantMatchReward({
      userId: 'user-14',
      matchId: 'm14',
      mode: 'RANKED_PVP',
      result: 'DRAW',
    });
    expect(result.xpGranted).toBe(REWARD_TABLE.RANKED_PVP.LOSS.xp);
  });

  it('a losing result never grants the first-win-of-day bonus', async () => {
    const result = await service.grantMatchReward({ userId: 'user-15', matchId: 'm15', mode: 'PVE', result: 'LOSS' });
    expect(result.firstWinBonus).toBe(false);
  });

  it('cosmetic level rewards are recorded as a UserUnlock', async () => {
    prisma.setUser('user-16', { xp: xpRequiredForLevel(4) - 5, lastFirstWinBonusDate: TODAY });
    await service.grantMatchReward({ userId: 'user-16', matchId: 'm16', mode: 'PVE', result: 'WIN' });
    const unlocks = prisma.unlocksFor('user-16');
    expect(unlocks).toHaveLength(1);
    expect(unlocks[0]!.key).toBe((LEVEL_REWARDS[4] as { key: string }).key);
    expect(unlocks[0]!.source).toBe('LEVEL_UP');
  });

  it('logs matchRewardGranted, firstWinOfDayGranted, levelUp, and progressionRewardUnlocked analytics events', async () => {
    prisma.setUser('user-17', { xp: xpRequiredForLevel(2) - 5 });
    await service.grantMatchReward({ userId: 'user-17', matchId: 'm17', mode: 'PVE', result: 'WIN' });
    const types = analytics.events.map((e) => e.type);
    expect(types).toContain('matchRewardGranted');
    expect(types).toContain('firstWinOfDayGranted');
    expect(types).toContain('levelUp');
    expect(types).toContain('progressionRewardUnlocked');
  });

  /**
   * Concurrency Correctness Closure Pass: the (matchId, userId) unique constraint only stops a
   * duplicate grant for the SAME match. Two DIFFERENT matches finishing concurrently for the same
   * account both read User.xp/softCurrency/lastFirstWinBonusDate/highestRewardedLevel, and without
   * per-account serialization each transaction computes its reward against the SAME stale
   * pre-reward state and overwrites the other's update - a classic lost-update race. These tests
   * prove that never happens, regardless of which of the two transactions the fake's deterministic
   * (but arbitrary, from the service's point of view) lock-acquisition order lets through first -
   * every assertion here is about the final aggregate state, not which matchId "won".
   */
  describe('concurrency: different matches, same user', () => {
    it('two concurrent wins both apply - no lost update, exactly one first-win bonus', async () => {
      const [a, b] = await Promise.all([
        service.grantMatchReward({ userId: 'user-race', matchId: 'match-A', mode: 'PVE', result: 'WIN' }),
        service.grantMatchReward({ userId: 'user-race', matchId: 'match-B', mode: 'PVE', result: 'WIN' }),
      ]);

      expect(a.granted).toBe(true);
      expect(b.granted).toBe(true);
      expect(prisma.rewardsFor('user-race')).toHaveLength(2);

      const win = REWARD_TABLE.PVE.WIN;
      const expectedXp = win.xp * 2 + FIRST_WIN_OF_DAY_BONUS.xp;
      let expectedCurrency = win.softCurrency * 2 + FIRST_WIN_OF_DAY_BONUS.softCurrency;
      for (let level = 2; level <= levelForXp(expectedXp); level += 1) {
        const def = LEVEL_REWARDS[level];
        if (def?.type === 'CURRENCY') expectedCurrency += def.amount;
      }

      const finalUser = prisma.getUser('user-race')!;
      expect(finalUser.xp).toBe(expectedXp);
      expect(finalUser.softCurrency).toBe(expectedCurrency);
      expect(finalUser.level).toBe(levelForXp(expectedXp));
      expect(finalUser.highestRewardedLevel).toBe(levelForXp(expectedXp));

      // Exactly one of the two got the daily bonus - never both, never neither.
      const bonusFlags = [a.firstWinBonus, b.firstWinBonus];
      expect(bonusFlags.filter(Boolean)).toHaveLength(1);
      const rewardRows = prisma.rewardsFor('user-race');
      expect(rewardRows.filter((r) => r.firstWinBonus)).toHaveLength(1);
      expect(rewardRows.filter((r) => !r.firstWinBonus)).toHaveLength(1);
    });

    it('a concurrent win and loss both apply - no lost update, only the win could ever carry the bonus', async () => {
      const [win, loss] = await Promise.all([
        service.grantMatchReward({ userId: 'user-race2', matchId: 'match-C', mode: 'PVE', result: 'WIN' }),
        service.grantMatchReward({ userId: 'user-race2', matchId: 'match-D', mode: 'PVE', result: 'LOSS' }),
      ]);

      expect(win.granted).toBe(true);
      expect(loss.granted).toBe(true);
      expect(prisma.rewardsFor('user-race2')).toHaveLength(2);

      const winReward = REWARD_TABLE.PVE.WIN;
      const lossReward = REWARD_TABLE.PVE.LOSS;
      const expectedXp = winReward.xp + lossReward.xp + FIRST_WIN_OF_DAY_BONUS.xp;
      let expectedCurrency = winReward.softCurrency + lossReward.softCurrency + FIRST_WIN_OF_DAY_BONUS.softCurrency;
      for (let level = 2; level <= levelForXp(expectedXp); level += 1) {
        const def = LEVEL_REWARDS[level];
        if (def?.type === 'CURRENCY') expectedCurrency += def.amount;
      }

      const finalUser = prisma.getUser('user-race2')!;
      expect(finalUser.xp).toBe(expectedXp);
      expect(finalUser.softCurrency).toBe(expectedCurrency);
      expect(finalUser.level).toBe(levelForXp(expectedXp));

      expect(win.firstWinBonus).toBe(true);
      expect(loss.firstWinBonus).toBe(false);
    });

    it('two concurrent matches crossing a cosmetic level threshold unlock it exactly once', async () => {
      prisma.setUser('user-race3', { xp: xpRequiredForLevel(4) - 5, lastFirstWinBonusDate: TODAY });
      await Promise.all([
        service.grantMatchReward({ userId: 'user-race3', matchId: 'match-E', mode: 'PVE', result: 'WIN' }),
        service.grantMatchReward({ userId: 'user-race3', matchId: 'match-F', mode: 'PVE', result: 'WIN' }),
      ]);

      const win = REWARD_TABLE.PVE.WIN;
      const expectedXp = xpRequiredForLevel(4) - 5 + win.xp * 2;
      const finalUser = prisma.getUser('user-race3')!;
      expect(finalUser.xp).toBe(expectedXp);
      expect(finalUser.level).toBe(levelForXp(expectedXp));
      expect(finalUser.highestRewardedLevel).toBe(levelForXp(expectedXp));

      const level4Key = (LEVEL_REWARDS[4] as { key: string }).key;
      const level4Unlocks = prisma.unlocksFor('user-race3').filter((u) => u.key === level4Key);
      expect(level4Unlocks).toHaveLength(1);
    });

    it('sequential serialized reward processing crosses multiple levels without duplicating any reward', async () => {
      prisma.setUser('user-seq', { lastFirstWinBonusDate: TODAY });
      const win = REWARD_TABLE.RANKED_PVP.WIN;
      let expectedXp = 0;
      for (let i = 0; i < 4; i += 1) {
        await service.grantMatchReward({
          userId: 'user-seq',
          matchId: `seq-${i}`,
          mode: 'RANKED_PVP',
          result: 'WIN',
        });
        expectedXp += win.xp;
      }

      const finalUser = prisma.getUser('user-seq')!;
      expect(finalUser.xp).toBe(expectedXp);
      expect(finalUser.level).toBe(levelForXp(expectedXp));
      expect(finalUser.highestRewardedLevel).toBe(levelForXp(expectedXp));

      // Every level-reward key granted along the way appears exactly once, however many
      // thresholds this sequence happened to cross.
      const unlocks = prisma.unlocksFor('user-seq');
      const cosmeticKeys = unlocks.map((u) => u.key);
      expect(new Set(cosmeticKeys).size).toBe(cosmeticKeys.length);
    });

    it('same-match idempotency still holds under the same per-user lock (no regression from the fix)', async () => {
      const [a, b] = await Promise.all([
        service.grantMatchReward({ userId: 'user-race4', matchId: 'match-same', mode: 'PVE', result: 'WIN' }),
        service.grantMatchReward({ userId: 'user-race4', matchId: 'match-same', mode: 'PVE', result: 'WIN' }),
      ]);
      const grantedCount = [a, b].filter((r) => r.granted).length;
      expect(grantedCount).toBe(1);
      expect(prisma.rewardsFor('user-race4')).toHaveLength(1);
      expect(prisma.getUser('user-race4')!.xp).toBe(REWARD_TABLE.PVE.WIN.xp + FIRST_WIN_OF_DAY_BONUS.xp);
    });
  });
});
