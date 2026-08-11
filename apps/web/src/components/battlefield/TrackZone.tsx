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
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center" role="status">
      <div className="animate-card-in flex flex-col items-center gap-1.5 rounded-xl border border-raido-cyan/40 bg-black/85 px-4 py-3 shadow-[0_0_24px_rgba(90,212,230,0.3)]">
        <img src={active.artworkUrl} alt="" className="h-14 w-14 rounded-full object-cover ring-2 ring-raido-cyan/50" />
        <span className="max-w-[10rem] truncate text-xs font-semibold text-raido-white">{active.name}</span>
        <span className="flex items-end gap-[2px]" aria-hidden="true">
          {[0, 1, 2, 3, 4, 3, 2, 1].map((h, i) => (
            <span
              key={i}
              className="animate-waveform-bar w-[3px] rounded-full bg-raido-cyan"
              style={{ height: `${4 + h * 2}px`, animationDelay: `${i * 70}ms` }}
            />
          ))}
        </span>
      </div>
    </div>
  );
}
