import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { MatchEventView } from '@kod-raido/shared';
import { useCombatFeedback } from './use-combat-feedback';

function event(type: string, payload: Record<string, unknown>): MatchEventView {
  return { type, payload };
}

describe('useCombatFeedback', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts with no feedback', () => {
    const { result } = renderHook(({ events }) => useCombatFeedback(events), {
      initialProps: { events: [] as MatchEventView[] },
    });
    expect(result.current.items).toEqual([]);
    expect(result.current.deathToasts).toEqual([]);
  });

  it('turns a UNIT_DAMAGED event into a floating damage item targeting the unit', () => {
    const { result, rerender } = renderHook(({ events }) => useCombatFeedback(events), {
      initialProps: { events: [] as MatchEventView[] },
    });

    rerender({ events: [event('UNIT_DAMAGED', { instanceId: 'u1', ownerId: 'p1', amount: 3, health: 2 })] });

    expect(result.current.items).toEqual([
      expect.objectContaining({ target: 'unit:u1', kind: 'damage', amount: 3 }),
    ]);
  });

  it('turns CONDUCTOR_HEALED into a heal item targeting the conductor', () => {
    const { result, rerender } = renderHook(({ events }) => useCombatFeedback(events), {
      initialProps: { events: [] as MatchEventView[] },
    });
    rerender({ events: [event('CONDUCTOR_HEALED', { playerId: 'p1', amount: 5, conductorHp: 20 })] });
    expect(result.current.items).toEqual([
      expect.objectContaining({ target: 'conductor:p1', kind: 'heal', amount: 5 }),
    ]);
  });

  it('expires feedback items after their TTL', () => {
    const { result, rerender } = renderHook(({ events }) => useCombatFeedback(events), {
      initialProps: { events: [] as MatchEventView[] },
    });
    rerender({ events: [event('UNIT_DAMAGED', { instanceId: 'u1', ownerId: 'p1', amount: 1 })] });
    expect(result.current.items).toHaveLength(1);

    act(() => {
      vi.advanceTimersByTime(800);
    });
    expect(result.current.items).toHaveLength(0);
  });

  it('does not replay already-processed events when the array is appended to', () => {
    const { result, rerender } = renderHook(({ events }) => useCombatFeedback(events), {
      initialProps: { events: [event('UNIT_DAMAGED', { instanceId: 'u1', ownerId: 'p1', amount: 1 })] },
    });
    expect(result.current.items).toHaveLength(1);

    act(() => {
      vi.advanceTimersByTime(800);
    });
    expect(result.current.items).toHaveLength(0);

    // Simulate the page appending a fresh batch to the same accumulated array.
    rerender({
      events: [
        event('UNIT_DAMAGED', { instanceId: 'u1', ownerId: 'p1', amount: 1 }),
        event('UNIT_DAMAGED', { instanceId: 'u2', ownerId: 'p1', amount: 2 }),
      ],
    });
    expect(result.current.items).toEqual([
      expect.objectContaining({ target: 'unit:u2', kind: 'damage', amount: 2 }),
    ]);
  });

  it('produces a death toast for UNIT_DIED that clears itself after its TTL', () => {
    const { result, rerender } = renderHook(({ events }) => useCombatFeedback(events), {
      initialProps: { events: [] as MatchEventView[] },
    });
    rerender({ events: [event('UNIT_DIED', { instanceId: 'u1', cardId: 'c1', ownerId: 'p1' })] });
    expect(result.current.deathToasts).toEqual([expect.objectContaining({ ownerId: 'p1', cardId: 'c1' })]);

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.deathToasts).toHaveLength(0);
  });

  it('increments resonanceTriggerKey and per-player runeTriggerKey on RUNE_ACTIVATED', () => {
    const { result, rerender } = renderHook(({ events }) => useCombatFeedback(events), {
      initialProps: { events: [] as MatchEventView[] },
    });
    expect(result.current.resonanceTriggerKey).toBe(0);

    rerender({ events: [event('RUNE_ACTIVATED', { playerId: 'p1', cardId: 'rune1' })] });

    expect(result.current.resonanceTriggerKey).toBe(1);
    expect(result.current.runeTriggerKey).toEqual({ playerId: 'p1', key: 1 });
  });

  it('sets a cardPlayTrigger on CARD_PLAYED (caller resolves the card type - TrackZone/CardPlayReveal each filter it)', () => {
    const { result, rerender } = renderHook(({ events }) => useCombatFeedback(events), {
      initialProps: { events: [] as MatchEventView[] },
    });
    rerender({ events: [event('CARD_PLAYED', { playerId: 'p1', cardId: 'card1', instanceId: 'i1', cost: 2 })] });
    expect(result.current.cardPlayTrigger).toEqual({ playerId: 'p1', cardId: 'card1', key: 1 });
  });
});
