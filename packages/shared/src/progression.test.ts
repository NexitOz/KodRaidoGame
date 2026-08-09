import { describe, expect, it } from 'vitest';
import { computeLevelForXp, computeMmrDelta, PVE_REWARDS, rankForMmr } from './progression.js';

describe('computeLevelForXp', () => {
  it('starts players at level 1 with 0 xp', () => {
    expect(computeLevelForXp(0)).toBe(1);
  });

  it('levels up every 100 xp', () => {
    expect(computeLevelForXp(99)).toBe(1);
    expect(computeLevelForXp(100)).toBe(2);
    expect(computeLevelForXp(250)).toBe(3);
  });

  it('never returns a level below 1', () => {
    expect(computeLevelForXp(-50)).toBe(1);
  });
});

describe('PVE_REWARDS', () => {
  it('rewards a win more than a loss', () => {
    expect(PVE_REWARDS.win.xp).toBeGreaterThan(PVE_REWARDS.loss.xp);
    expect(PVE_REWARDS.win.softCurrency).toBeGreaterThan(PVE_REWARDS.loss.softCurrency);
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
