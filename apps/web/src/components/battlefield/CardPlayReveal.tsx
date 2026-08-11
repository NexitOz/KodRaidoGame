'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import type { Card } from '@kod-raido/shared';
import { Icon } from '@kod-raido/ui';

export interface CardPlayTrigger {
  playerId: string;
  cardId: string;
  key: number;
}

export interface CardPlayRevealProps {
  trigger: CardPlayTrigger | null;
  cardsById: Map<string, Card>;
}

const RUNE_DISPLAY_MS = 400;
const EVENT_DISPLAY_MS = 380;

/**
 * Generic center-of-board reveal for RUNE and EVENT plays (section 15/2 of visual-polish-01) -
 * keyed only by `card.type`, never by cardId. CHARACTER already gets its own reveal via
 * CreatureSlot's `summonedThisTurn` mount animation, and TRACK keeps its own dedicated
 * `TrackZone` component (distinct waveform identity), so this only ever renders for RUNE/EVENT.
 * Uses the same `cardPlayTrigger` source as TrackZone - a CARD_PLAYED event fires for every card
 * type; this component just filters to the two types TrackZone doesn't handle. No engine timing
 * changes - purely a client-side reaction to an event that already exists.
 *
 * Reduced motion / Low Data Mode: the transform+opacity keyframe (`animate-rune-reveal` /
 * `animate-event-flash`) is disabled globally for both settings (globals.css), leaving only the
 * plain `opacity` transition below - a real "minimal fade", not an instant pop-in, since the
 * fade is a base CSS transition independent of the keyframe animation.
 */
export function CardPlayReveal({ trigger, cardsById }: CardPlayRevealProps) {
  const [active, setActive] = useState<{ card: Card; visible: boolean } | null>(null);

  useEffect(() => {
    if (!trigger) return undefined;
    const card = cardsById.get(trigger.cardId);
    if (!card || (card.type !== 'RUNE' && card.type !== 'EVENT')) return undefined;

    setActive({ card, visible: false });
    const raf = requestAnimationFrame(() => setActive((prev) => (prev ? { ...prev, visible: true } : prev)));
    const displayMs = card.type === 'RUNE' ? RUNE_DISPLAY_MS : EVENT_DISPLAY_MS;
    const timer = setTimeout(() => setActive(null), displayMs);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger?.key]);

  if (!active) return null;
  const { card, visible } = active;
  const isRune = card.type === 'RUNE';

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center" role="status">
      <div
        className={clsx(
          'flex flex-col items-center gap-1 rounded-xl border px-3 py-2 opacity-0 transition-opacity duration-150',
          visible && (isRune ? 'animate-rune-reveal opacity-100' : 'animate-event-flash opacity-100'),
          isRune
            ? 'border-raido-red/40 bg-black/85 shadow-rune'
            : 'border-raido-gold/40 bg-black/85 shadow-legendary',
        )}
      >
        <span className={clsx('flex h-8 w-8 items-center justify-center rounded-full', isRune ? 'text-raido-red' : 'text-raido-gold')}>
          <Icon name={isRune ? 'rune' : 'sword'} size={18} />
        </span>
        <span className="max-w-[8rem] truncate text-[11px] font-semibold text-raido-white">{card.name}</span>
      </div>
    </div>
  );
}
