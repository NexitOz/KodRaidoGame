import { describe, expect, it } from 'vitest';
import { RESONANCE_QUEUE_NAME } from './resonance-queue.js';

describe('resonance queue', () => {
  it('has a stable queue name', () => {
    expect(RESONANCE_QUEUE_NAME).toBe('resonance-recalculate');
  });
});
