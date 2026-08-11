import { beforeEach, describe, expect, it } from 'vitest';
import { xpRequiredForLevel } from '@kod-raido/shared';
import { ProgressionService } from './progression.service';

interface FakeUser {
  id: string;
  xp: number;
  softCurrency: number;
  lastFirstWinBonusDate: string | null;
}

interface FakeMatchRow {
  player1Id: string;
  player2Id: string | null;
  player2IsBot: boolean;
  winnerId: string | null;
}

function createFakePrisma() {
  const users = new Map<string, FakeUser>();
  const matches: FakeMatchRow[] = [];
  const unlocks: Array<{ userId: string; type: string }> = [];

  return {
    user: {
      async findUniqueOrThrow({ where }: { where: { id: string } }) {
        const user = users.get(where.id);
        if (!user) throw new Error('user not found');
        return user;
      },
    },
    userUnlock: {
      async count({ where }: { where: { userId: string; type: string } }) {
        return unlocks.filter((u) => u.userId === where.userId && u.type === where.type).length;
      },
    },
    match: {
      async findMany({ where }: { where: { OR: Array<{ player1Id?: string; player2Id?: string }> } }) {
        const userId = where.OR[0]!.player1Id!;
        return matches.filter((m) => m.player1Id === userId || m.player2Id === userId);
      },
    },
    setUser: (id: string, patch: Partial<FakeUser>) => {
      users.set(id, { id, xp: 0, softCurrency: 0, lastFirstWinBonusDate: null, ...patch });
    },
    addMatch: (row: FakeMatchRow) => matches.push(row),
    addUnlock: (userId: string, type = 'COSMETIC') => unlocks.push({ userId, type }),
  };
}

describe('ProgressionService', () => {
  let prisma: ReturnType<typeof createFakePrisma>;
  let service: ProgressionService;

  beforeEach(() => {
    prisma = createFakePrisma();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    service = new ProgressionService(prisma as any);
  });

  it('reports the correct current level for a given xp total', async () => {
    prisma.setUser('u1', { xp: xpRequiredForLevel(4) + 10 });
    const view = await service.getProgressionView('u1');
    expect(view.level).toBe(4);
    expect(view.totalXp).toBe(xpRequiredForLevel(4) + 10);
  });

  it('reports correct xp progress within the current level', async () => {
    prisma.setUser('u2', { xp: xpRequiredForLevel(2) + 30 });
    const view = await service.getProgressionView('u2');
    expect(view.currentLevelXp).toBe(30);
    expect(view.nextLevelXp).toBe(xpRequiredForLevel(3) - xpRequiredForLevel(2));
  });

  it('reports the next reward threshold and its content', async () => {
    prisma.setUser('u3', { xp: xpRequiredForLevel(2) });
    const view = await service.getProgressionView('u3');
    expect(view.nextReward).not.toBeNull();
    expect(view.nextReward!.level).toBe(3);
    expect(view.nextReward!.xpNeeded).toBe(xpRequiredForLevel(3) - xpRequiredForLevel(2));
  });

  it('reports firstWinClaimedToday accurately', async () => {
    const today = new Date().toISOString().slice(0, 10);
    prisma.setUser('u4', { lastFirstWinBonusDate: today });
    prisma.setUser('u5', { lastFirstWinBonusDate: '2020-01-01' });
    const claimed = await service.getProgressionView('u4');
    const notClaimed = await service.getProgressionView('u5');
    expect(claimed.firstWinClaimedToday).toBe(true);
    expect(notClaimed.firstWinClaimedToday).toBe(false);
  });

  it('reports the current soft currency balance', async () => {
    prisma.setUser('u6', { softCurrency: 1234 });
    const view = await service.getProgressionView('u6');
    expect(view.softCurrency).toBe(1234);
  });

  it('computes wins/losses/winRate/pveWins/pvpWins from finished matches', async () => {
    prisma.setUser('u7', {});
    prisma.addMatch({ player1Id: 'u7', player2Id: null, player2IsBot: true, winnerId: 'u7' }); // PvE win
    prisma.addMatch({ player1Id: 'u7', player2Id: null, player2IsBot: true, winnerId: 'bot' }); // PvE loss
    prisma.addMatch({ player1Id: 'other', player2Id: 'u7', player2IsBot: false, winnerId: 'u7' }); // PvP win
    prisma.addMatch({ player1Id: 'u7', player2Id: 'other2', player2IsBot: false, winnerId: null }); // draw, excluded

    const view = await service.getProgressionView('u7');
    expect(view.stats.wins).toBe(2);
    expect(view.stats.losses).toBe(1);
    expect(view.stats.pveWins).toBe(1);
    expect(view.stats.pvpWins).toBe(1);
    expect(view.stats.winRate).toBe(67); // round(2/3 * 100)
  });

  it('counts unlocked cosmetics', async () => {
    prisma.setUser('u8', {});
    prisma.addUnlock('u8');
    prisma.addUnlock('u8');
    const view = await service.getProgressionView('u8');
    expect(view.unlockedCosmetics).toBe(2);
  });

  it('returns null nextReward at MAX_LEVEL with no remaining defined reward levels', async () => {
    prisma.setUser('u9', { xp: xpRequiredForLevel(30) });
    const view = await service.getProgressionView('u9');
    expect(view.nextReward).toBeNull();
  });
});
