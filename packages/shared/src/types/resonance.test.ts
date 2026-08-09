import { describe, expect, it } from 'vitest';
import { computeResonanceScore, tierFromScore, RANKED_BOOST_PERCENT_BY_TIER } from './resonance.js';

describe('tierFromScore', () => {
  it('maps boundary scores to the documented tiers', () => {
    expect(tierFromScore(0)).toBe(0);
    expect(tierFromScore(19)).toBe(0);
    expect(tierFromScore(20)).toBe(1);
    expect(tierFromScore(39)).toBe(1);
    expect(tierFromScore(40)).toBe(2);
    expect(tierFromScore(59)).toBe(2);
    expect(tierFromScore(60)).toBe(3);
    expect(tierFromScore(74)).toBe(3);
    expect(tierFromScore(75)).toBe(4);
    expect(tierFromScore(89)).toBe(4);
    expect(tierFromScore(90)).toBe(5);
    expect(tierFromScore(100)).toBe(5);
  });

  it('clamps out-of-range scores', () => {
    expect(tierFromScore(-50)).toBe(0);
    expect(tierFromScore(500)).toBe(5);
  });
});

describe('computeResonanceScore', () => {
  it('applies the documented weighted formula', () => {
    const score = computeResonanceScore({
      listensTrend: 100,
      likesTrend: 100,
      commentsTrend: 100,
      sharesTrend: 100,
      soundUsesTrend: 100,
    });
    expect(score).toBe(100);
  });

  it('weighs listens the heaviest', () => {
    const listensOnly = computeResonanceScore({
      listensTrend: 100,
      likesTrend: 0,
      commentsTrend: 0,
      sharesTrend: 0,
      soundUsesTrend: 0,
    });
    const commentsOnly = computeResonanceScore({
      listensTrend: 0,
      likesTrend: 0,
      commentsTrend: 100,
      sharesTrend: 0,
      soundUsesTrend: 0,
    });
    expect(listensOnly).toBeGreaterThan(commentsOnly);
    expect(listensOnly).toBe(30);
    expect(commentsOnly).toBe(15);
  });
});

describe('RANKED_BOOST_PERCENT_BY_TIER', () => {
  it('never exceeds the documented 10% ranked cap', () => {
    for (const percent of Object.values(RANKED_BOOST_PERCENT_BY_TIER)) {
      expect(percent).toBeLessThanOrEqual(10);
    }
    expect(RANKED_BOOST_PERCENT_BY_TIER[5]).toBe(10);
    expect(RANKED_BOOST_PERCENT_BY_TIER[0]).toBe(0);
  });
});
