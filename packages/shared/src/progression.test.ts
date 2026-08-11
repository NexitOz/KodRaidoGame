import { describe, expect, it } from 'vitest';
import {
  computeLevelForXp,
  computeMmrDelta,
  FIRST_WIN_OF_DAY_BONUS,
  LEVEL_REWARDS,
  MAX_LEVEL,
  rankForMmr,
  REWARD_TABLE,
  rewardFor,
  xpProgressForLevel,
  xpRequiredForLevel,
} from './progression.js';

describe('computeLevelForXp', () => {
  it('starts players at level 1 with 0 xp', () => {
    expect(computeLevelForXp(0)).toBe(1);
  });

  it('matches the worked curve example from the spec', () => {
    expect(computeLevelForXp(99)).toBe(1);
    expect(computeLevelForXp(100)).toBe(2);
    expect(computeLevelForXp(219)).toBe(2);
    expect(computeLevelForXp(220)).toBe(3);
    expect(computeLevelForXp(250)).toBe(3);
    expect(computeLevelForXp(360)).toBe(4);
    expect(computeLevelForXp(520)).toBe(5);
  });

  it('never returns a level below 1', () => {
    expect(computeLevelForXp(-50)).toBe(1);
  });

  it('caps at MAX_LEVEL for huge XP totals', () => {
    expect(computeLevelForXp(1_000_000)).toBe(MAX_LEVEL);
  });
});

describe('xpRequiredForLevel', () => {
  it('requires 0 xp for level 1', () => {
    expect(xpRequiredForLevel(1)).toBe(0);
  });

  it('is strictly increasing across levels', () => {
    let prev = xpRequiredForLevel(1);
    for (let level = 2; level <= MAX_LEVEL; level += 1) {
      const next = xpRequiredForLevel(level);
      expect(next).toBeGreaterThan(prev);
      prev = next;
    }
  });

  it('is the inverse of computeLevelForXp at each threshold', () => {
    for (let level = 1; level <= MAX_LEVEL; level += 1) {
      expect(computeLevelForXp(xpRequiredForLevel(level))).toBe(level);
    }
  });
});

describe('xpProgressForLevel', () => {
  it('reports 0 progress at the very start', () => {
    const progress = xpProgressForLevel(0);
    expect(progress.level).toBe(1);
    expect(progress.currentLevelXp).toBe(0);
    expect(progress.progressPercent).toBe(0);
  });

  it('reports partial progress mid-level', () => {
    const progress = xpProgressForLevel(160); // level 2 starts at 100, level 3 at 220
    expect(progress.level).toBe(2);
    expect(progress.currentLevelXp).toBe(60);
    expect(progress.xpForNextLevel).toBe(120);
    expect(progress.progressPercent).toBe(50);
  });

  it('reports 100% progress and a null next-level span at MAX_LEVEL', () => {
    const progress = xpProgressForLevel(xpRequiredForLevel(MAX_LEVEL) + 5000);
    expect(progress.level).toBe(MAX_LEVEL);
    expect(progress.xpForNextLevel).toBeNull();
    expect(progress.progressPercent).toBe(100);
  });
});

describe('REWARD_TABLE / rewardFor', () => {
  it('rewards a win more than a loss for every mode', () => {
    for (const mode of ['PVE', 'CASUAL_PVP', 'RANKED_PVP'] as const) {
      expect(REWARD_TABLE[mode].WIN.xp).toBeGreaterThan(REWARD_TABLE[mode].LOSS.xp);
      expect(REWARD_TABLE[mode].WIN.softCurrency).toBeGreaterThan(REWARD_TABLE[mode].LOSS.softCurrency);
    }
  });

  it('rewards ranked PvP more than casual PvP more than PvE for the same outcome', () => {
    expect(REWARD_TABLE.RANKED_PVP.WIN.xp).toBeGreaterThan(REWARD_TABLE.CASUAL_PVP.WIN.xp);
    expect(REWARD_TABLE.CASUAL_PVP.WIN.xp).toBeGreaterThan(REWARD_TABLE.PVE.WIN.xp);
  });

  it('treats a draw the same as a loss', () => {
    expect(rewardFor('PVE', 'DRAW')).toEqual(rewardFor('PVE', 'LOSS'));
  });

  it('rewardFor looks up the exact table entry', () => {
    expect(rewardFor('RANKED_PVP', 'WIN')).toEqual(REWARD_TABLE.RANKED_PVP.WIN);
  });
});

describe('FIRST_WIN_OF_DAY_BONUS', () => {
  it('grants both xp and currency', () => {
    expect(FIRST_WIN_OF_DAY_BONUS.xp).toBeGreaterThan(0);
    expect(FIRST_WIN_OF_DAY_BONUS.softCurrency).toBeGreaterThan(0);
  });
});

describe('LEVEL_REWARDS', () => {
  it('defines a reward for every level from 2 to 10', () => {
    for (let level = 2; level <= 10; level += 1) {
      expect(LEVEL_REWARDS[level]).toBeDefined();
    }
  });

  it('never defines a reward for level 1 (nothing to reward at account creation)', () => {
    expect(LEVEL_REWARDS[1]).toBeUndefined();
  });
});

describe('rankForMmr', () => {
  it('places a starting player (1000 mmr) in Bronze', () => {
    expect(rankForMmr(1000).tier).toBe('BRONZE');
  });

  it('places sub-1000 mmr in Iron', () => {
    expect(rankForMmr(0).tier).toBe('IRON');
    expect(rankForMmr(999).tier).toBe('IRON');
  });

  it('places 2000+ mmr in Raido', () => {
    expect(rankForMmr(2000).tier).toBe('RAIDO');
    expect(rankForMmr(5000).tier).toBe('RAIDO');
  });

  it('is monotonically non-decreasing as mmr increases', () => {
    const tiers = [0, 999, 1000, 1199, 1200, 1399, 1400, 1599, 1600, 1799, 1800, 1999, 2000].map(
      (mmr) => RANK_ORDER.indexOf(rankForMmr(mmr).tier),
    );
    for (let i = 1; i < tiers.length; i += 1) {
      expect(tiers[i]).toBeGreaterThanOrEqual(tiers[i - 1]!);
    }
  });
});

const RANK_ORDER = ['IRON', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND', 'RAIDO'];

describe('computeMmrDelta', () => {
  it('awards equal and opposite deltas between two evenly matched players', () => {
    const winnerDelta = computeMmrDelta(1000, 1000, 'WIN');
    const loserDelta = computeMmrDelta(1000, 1000, 'LOSS');
    expect(winnerDelta).toBeGreaterThan(0);
    expect(loserDelta).toBeLessThan(0);
    expect(winnerDelta).toBe(-loserDelta);
  });

  it('awards fewer points for beating a much weaker opponent', () => {
    const beatWeaker = computeMmrDelta(1500, 1000, 'WIN');
    const beatEqual = computeMmrDelta(1000, 1000, 'WIN');
    expect(beatWeaker).toBeLessThan(beatEqual);
    expect(beatWeaker).toBeGreaterThanOrEqual(0);
  });

  it('penalizes losing to a much weaker opponent more than losing to an equal one', () => {
    const loseToWeaker = computeMmrDelta(1500, 1000, 'LOSS');
    const loseToEqual = computeMmrDelta(1000, 1000, 'LOSS');
    expect(loseToWeaker).toBeLessThan(loseToEqual);
  });

  it('returns roughly zero for a draw between evenly matched players', () => {
    expect(computeMmrDelta(1000, 1000, 'DRAW')).toBe(0);
  });
});
