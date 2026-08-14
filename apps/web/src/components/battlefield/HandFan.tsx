'use client';

import clsx from 'clsx';
import type { Card } from '@kod-raido/shared';
import { CardView } from '@kod-raido/ui';
import { useLongPress } from '@/lib/use-long-press';
import { playSfx } from '@/lib/sfx';

export interface HandCardEntry {
  instanceId: string;
  card: Card;
}

export interface HandFanProps {
  cards: HandCardEntry[];
  energy: number;
  selectedInstanceId?: string | null;
  disabled?: boolean;
  onSelect: (instanceId: string, cost: number) => void;
  onPreview: (card: Card) => void;
}

const ANGLE_STEP_DEG = 6;
const ARC_STEP_PX = 5;
// Battlefield 3.1: hand cards moved from CardView's 'xs' to 'sm' size (92px -> 140px) so they
// read as valuable collectible pieces instead of thumbnails - the trade-off is a wider overlap
// to keep a typical hand from overrunning mobile width; the wrapper below already scrolls
// horizontally for the rare very-large hand.
const OVERLAP_PX = 62;

/** Keyed by card TYPE, never by cardId - the tutorial overlay spotlights whichever hand card
 * happens to satisfy the current step's objective, regardless of which specific card it is. */
const HAND_TUTORIAL_TARGET: Partial<Record<Card['type'], string>> = {
  CHARACTER: 'hand-character',
  RUNE: 'hand-rune',
  TRACK: 'hand-track',
  EVENT: 'hand-event',
};

export function HandFan({
  cards,
  energy,
  selectedInstanceId,
  disabled,
  onSelect,
  onPreview,
}: HandFanProps) {
  const center = (cards.length - 1) / 2;

  return (
    <div
      className="flex justify-center overflow-x-auto px-2 pb-1 pt-2"
      role="list"
      aria-label={`Рука, ${cards.length} карт`}
    >
      <div className="flex" style={{ marginLeft: cards.length > 1 ? OVERLAP_PX : 0 }}>
        {cards.map(({ instanceId, card }, i) => (
          <HandCardItem
            key={instanceId}
            card={card}
            offsetFromCenter={i - center}
            marginLeft={i === 0 ? 0 : -OVERLAP_PX}
            zIndex={i}
            selected={selectedInstanceId === instanceId}
            affordable={card.cost <= energy}
            disabled={disabled}
            onSelect={() => {
              playSfx('card-select');
              onSelect(instanceId, card.cost);
            }}
            onPreview={() => onPreview(card)}
          />
        ))}
      </div>
    </div>
  );
}

interface HandCardItemProps {
  card: Card;
  offsetFromCenter: number;
  marginLeft: number;
  zIndex: number;
  selected: boolean;
  affordable: boolean;
  disabled?: boolean;
  onSelect: () => void;
  onPreview: () => void;
}

function HandCardItem({
  card,
  offsetFromCenter,
  marginLeft,
  zIndex,
  selected,
  affordable,
  disabled,
  onSelect,
  onPreview,
}: HandCardItemProps) {
  const longPress = useLongPress(onPreview);

  return (
    <div
      role="listitem"
      className={clsx(
        'relative shrink-0 transition-transform duration-150 ease-out',
        selected && '[filter:drop-shadow(0_0_10px_rgba(255,45,85,0.5))]',
      )}
      style={{
        marginLeft,
        zIndex: selected ? 100 : zIndex,
        transform: selected
          ? 'translateY(-18px) scale(1.06) rotate(0deg)'
          : `translateY(${Math.abs(offsetFromCenter) * ARC_STEP_PX}px) rotate(${offsetFromCenter * ANGLE_STEP_DEG}deg)`,
      }}
      onPointerDown={longPress.onPointerDown}
      onPointerUp={longPress.onPointerUp}
      onPointerLeave={longPress.onPointerLeave}
      onPointerCancel={longPress.onPointerCancel}
      onClickCapture={longPress.onClickCapture}
      data-tutorial-target={HAND_TUTORIAL_TARGET[card.type]}
    >
      <CardView
        card={card}
        size="sm"
        onSelect={disabled ? undefined : onSelect}
        className={clsx(
          'animate-card-in',
          selected && 'ring-2 ring-raido-red shadow-[0_0_22px_rgba(227,18,62,0.45)]',
          !affordable && 'opacity-40',
          disabled && 'pointer-events-none',
        )}
      />
      {/* Battlefield 3.1: sits below the cost/Resonance row (which now spans the card's full top
          edge at the larger 'sm' CardView size) instead of on top of it. */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onPreview();
        }}
        aria-label={`Просмотреть карту: ${card.name}`}
        className="absolute right-0.5 top-9 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs text-raido-white ring-1 ring-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-raido-red"
      >
        ℹ
      </button>
    </div>
  );
}
