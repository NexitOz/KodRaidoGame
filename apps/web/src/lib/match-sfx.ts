import type { MatchEventView } from '@kod-raido/shared';
import { playSfx, type SfxCue } from './sfx';

/**
 * Batches of engine events (e.g. a whole bot turn) arrive together; playing
 * one tone per event would sound like a machine gun, so this picks a single
 * representative cue for the batch by priority (a death matters more than a
 * card play in the same update).
 */
const EVENT_TO_CUE: Partial<Record<string, SfxCue>> = {
  UNIT_DIED: 'unit-death',
  CONDUCTOR_DAMAGED: 'attack',
  ATTACK: 'attack',
  CARD_PLAYED: 'card-play',
  UNIT_SUMMONED: 'card-play',
  TURN_END: 'turn-end',
};

const CUE_PRIORITY: SfxCue[] = ['unit-death', 'attack', 'card-play', 'turn-end'];

export function playSfxForEvents(events: MatchEventView[]): void {
  const present = new Set<SfxCue>();
  for (const event of events) {
    const cue = EVENT_TO_CUE[event.type];
    if (cue) present.add(cue);
  }
  for (const cue of CUE_PRIORITY) {
    if (present.has(cue)) {
      playSfx(cue);
      return;
    }
  }
}
