'use client';

import { useEffect, useState } from 'react';
import type { Card } from '@kod-raido/shared';

export interface TrackTrigger {
  playerId: string;
  cardId: string;
  key: number;
}

export interface TrackZoneProps {
  trigger: TrackTrigger | null;
  cardsById: Map<string, Card>;
}

const DISPLAY_MS = 1100;

/**
 * A CARD_PLAYED event fires for every card type; this only reacts when the
 * played card resolves (via the shared card catalogue lookup) to a TRACK
 * card, and purely as a visual — the engine has already applied the card's
 * effect and moved it to the discard pile by the time this renders, per the
 * existing rules (spec explicitly says not to change those rules).
 */
export function TrackZone({ trigger, cardsById }: TrackZoneProps) {
  const [active, setActive] = useState<Card | null>(null);

  useEffect(() => {
    if (!trigger) return undefined;
    const card = cardsById.get(trigger.cardId);
    if (!card || card.type !== 'TRACK') return undefined;
    setActive(card);
    const timer = setTimeout(() => setActive(null), DISPLAY_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger?.key]);

  if (!active) return null;

  return (
    // Battlefield Visual Target 3.0 (section 11): Track activation reads as a small resonance
    // waveform reacting near the zone, not a full-screen popup card - the arena-wide ring
    // (BattlefieldArena's pulseKey, driven from the same trigger in MatchBoard) carries the "this
    // reached the whole board" read instead.
    <div
      className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
      role="status"
    >
      <div className="animate-card-in flex items-center gap-1.5 rounded-full border border-raido-cyan/40 bg-black/70 py-1 pl-1 pr-2.5 shadow-[0_0_14px_rgba(90,212,230,0.25)]">
        <span aria-hidden className="h-6 w-[3px] flex-shrink-0 rounded-full bg-raido-cyan/70" />
        <img
          src={active.artworkUrl}
          alt=""
          className="h-5 w-5 flex-shrink-0 rounded-full object-cover ring-1 ring-raido-cyan/50"
        />
        <span className="flex flex-col leading-tight">
          <span className="text-[8px] font-bold uppercase tracking-widest text-raido-cyan/80">
            Трек
          </span>
          <span className="max-w-[7rem] truncate text-[10px] font-semibold text-raido-white">
            {active.name}
          </span>
        </span>
        <span className="flex items-end gap-[1.5px]" aria-hidden="true">
          {[0, 1, 2, 1, 0].map((h, i) => (
            <span
              key={i}
              className="animate-waveform-bar w-[2px] rounded-full bg-raido-cyan"
              style={{ height: `${3 + h * 2}px`, animationDelay: `${i * 70}ms` }}
            />
          ))}
        </span>
      </div>
    </div>
  );
}
