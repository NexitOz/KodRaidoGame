'use client';

import { useEffect, useRef, useState } from 'react';
import type { MatchEventView } from '@kod-raido/shared';

export type FeedbackKind = 'damage' | 'heal' | 'shield';

export interface FeedbackItem {
  id: number;
  /** `unit:<instanceId>` or `conductor:<playerId>` */
  target: string;
  kind: FeedbackKind;
  amount?: number;
}

export interface DeathToast {
  id: number;
  ownerId: string;
  cardId: string;
}

const FEEDBACK_TTL_MS = 700;
const DEATH_TOAST_TTL_MS = 900;

let nextFeedbackId = 0;

/**
 * Turns the raw event log both match screens already receive into short-lived
 * local visual feedback (floating damage/heal numbers, a resonance/rune pulse
 * trigger, a track-play trigger). Diffs the `events` prop against what it has
 * already processed rather than replaying the whole accumulated history on
 * every render — the page components already accumulate `events` into a
 * capped array for the event log, this hook just watches the same array.
 *
 * Unit death is deliberately NOT pinned to the vanished unit's board slot:
 * by the time UNIT_DIED is visible, the engine has already removed the unit
 * from `board` and the row has recompacted, so there's no stable slot left to
 * animate at. Instead it surfaces as a brief row-level toast (see DeathToast)
 * — simpler and robust across every breakpoint instead of a fragile "freeze
 * the old layout for one frame" reconciliation.
 */
export function useCombatFeedback(events: MatchEventView[]) {
  const processedCount = useRef(0);
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [deathToasts, setDeathToasts] = useState<DeathToast[]>([]);
  const [resonanceTriggerKey, setResonanceTriggerKey] = useState(0);
  const [runeTriggerKey, setRuneTriggerKey] = useState<{ playerId: string; key: number } | null>(null);
  const [trackTrigger, setTrackTrigger] = useState<{ playerId: string; cardId: string; key: number } | null>(
    null,
  );

  useEffect(() => {
    if (events.length <= processedCount.current) {
      // Array reset (fresh match / navigated away and back) — resync without replaying old events.
      processedCount.current = events.length;
      return;
    }
    const freshEvents = events.slice(processedCount.current);
    processedCount.current = events.length;

    const newItems: FeedbackItem[] = [];
    const newDeaths: DeathToast[] = [];

    for (const event of freshEvents) {
      const payload = event.payload as Record<string, unknown>;
      switch (event.type) {
        case 'UNIT_DAMAGED':
          newItems.push({
            id: nextFeedbackId++,
            target: `unit:${payload.instanceId as string}`,
            kind: 'damage',
            amount: payload.amount as number,
          });
          break;
        case 'CONDUCTOR_DAMAGED':
          newItems.push({
            id: nextFeedbackId++,
            target: `conductor:${payload.playerId as string}`,
            kind: 'damage',
            amount: payload.amount as number,
          });
          break;
        case 'UNIT_HEALED':
          newItems.push({
            id: nextFeedbackId++,
            target: `unit:${payload.instanceId as string}`,
            kind: 'heal',
            amount: payload.amount as number,
          });
          break;
        case 'CONDUCTOR_HEALED':
          newItems.push({
            id: nextFeedbackId++,
            target: `conductor:${payload.playerId as string}`,
            kind: 'heal',
            amount: payload.amount as number,
          });
          break;
        case 'SHIELD_CONSUMED':
          newItems.push({ id: nextFeedbackId++, target: `unit:${payload.instanceId as string}`, kind: 'shield' });
          break;
        case 'UNIT_DIED':
          newDeaths.push({
            id: nextFeedbackId++,
            ownerId: payload.ownerId as string,
            cardId: payload.cardId as string,
          });
          break;
        case 'RUNE_ACTIVATED':
          setRuneTriggerKey((prev) => ({ playerId: payload.playerId as string, key: (prev?.key ?? 0) + 1 }));
          setResonanceTriggerKey((k) => k + 1);
          break;
        case 'CARD_PLAYED':
          setTrackTrigger((prev) => ({
            playerId: payload.playerId as string,
            cardId: payload.cardId as string,
            key: (prev?.key ?? 0) + 1,
          }));
          break;
        default:
          break;
      }
    }

    if (newItems.length > 0) {
      setItems((prev) => [...prev, ...newItems]);
      for (const item of newItems) {
        setTimeout(() => setItems((prev) => prev.filter((i) => i.id !== item.id)), FEEDBACK_TTL_MS);
      }
    }
    if (newDeaths.length > 0) {
      setDeathToasts((prev) => [...prev, ...newDeaths]);
      for (const death of newDeaths) {
        setTimeout(() => setDeathToasts((prev) => prev.filter((d) => d.id !== death.id)), DEATH_TOAST_TTL_MS);
      }
    }
  }, [events]);

  return { items, deathToasts, resonanceTriggerKey, runeTriggerKey, trackTrigger };
}
