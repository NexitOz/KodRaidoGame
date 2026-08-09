import { describe, expect, it } from 'vitest';
import { computeLevelForXp, PVE_REWARDS } from './progression.js';

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
