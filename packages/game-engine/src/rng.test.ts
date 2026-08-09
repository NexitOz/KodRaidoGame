import { describe, expect, it } from 'vitest';
import { createRng, pickRandom, shuffle } from './rng.js';

describe('createRng', () => {
  it('is deterministic for a given seed', () => {
    const a = createRng('seed-1');
    const b = createRng('seed-1');
    const seqA = Array.from({ length: 10 }, () => a());
    const seqB = Array.from({ length: 10 }, () => b());
    expect(seqA).toEqual(seqB);
  });

  it('produces different sequences for different seeds', () => {
    const a = createRng('seed-1');
    const b = createRng('seed-2');
    expect(a()).not.toBe(b());
  });

  it('returns values in [0, 1)', () => {
    const rng = createRng('range-check');
    for (let i = 0; i < 200; i += 1) {
      const value = rng();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });
});

describe('shuffle', () => {
  it('is deterministic and preserves the original elements', () => {
    const input = Array.from({ length: 20 }, (_, i) => i);
    const shuffled1 = shuffle(input, createRng('shuffle-seed'));
    const shuffled2 = shuffle(input, createRng('shuffle-seed'));
    expect(shuffled1).toEqual(shuffled2);
    expect([...shuffled1].sort((a, b) => a - b)).toEqual(input);
  });

  it('does not mutate the input array', () => {
    const input = [1, 2, 3];
    shuffle(input, createRng('no-mutate'));
    expect(input).toEqual([1, 2, 3]);
  });
});

describe('pickRandom', () => {
  it('returns undefined for an empty array', () => {
    expect(pickRandom([], createRng('empty'))).toBeUndefined();
  });

  it('always returns an element from the array', () => {
    const items = ['a', 'b', 'c'];
    const rng = createRng('pick');
    for (let i = 0; i < 20; i += 1) {
      expect(items).toContain(pickRandom(items, rng));
    }
  });
});
