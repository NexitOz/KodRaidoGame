'use client';

import clsx from 'clsx';
import type { Card } from '@kod-raido/shared';
import { CardView } from '@kod-raido/ui';
import { useDragToPlay } from '@/lib/use-drag-to-play';
import { playSfx } from '@/lib/sfx';
import styles from './HandFan.module.css';

export interface HandCardEntry {
  instanceId: string;
  card: Card;
}

export interface HandFanProps {
  cards: HandCardEntry[];
  energy: number;
  /** Which card (if any) currently has its enlarged preview open - a second tap on this same
   * card closes it. */
  previewedInstanceId?: string | null;
  disabled?: boolean;
  /** Plain tap: opens/closes the enlarged preview. Never plays the card by itself anymore -
   * playing is press-hold + drag + release onto the battlefield (see `onPlayByDrag`). */
  onTogglePreview: (card: Card, instanceId: string) => void;
  /** Drop resolution from a completed drag: `zone` is the `data-drop-zone` value under the
   * release point (an empty/occupied board slot, a conductor, the general board area), or null
   * if released somewhere that isn't a valid target - callers should treat null as "cancelled". */
  onPlayByDrag: (instanceId: string, cost: number, zone: string | null) => void;
}

const ANGLE_STEP_DEG = 5;
const ARC_STEP_PX = 3;
const OVERLAP_PX = 22;

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
  previewedInstanceId,
  disabled,
  onTogglePreview,
  onPlayByDrag,
}: HandFanProps) {
  const center = (cards.length - 1) / 2;

  const { dragCard, ghostRef, bind } = useDragToPlay({
    disabled,
    onTap: (card, instanceId) => {
      playSfx('card-select');
      onTogglePreview(card, instanceId);
    },
    onDrop: (instanceId, cost, zone) => {
      if (zone) playSfx('card-select');
      onPlayByDrag(instanceId, cost, zone);
    },
  });

  return (
    <div
      className="flex justify-center overflow-x-auto px-2 pb-1 pt-2 lg:overflow-visible lg:px-0 lg:pb-0 lg:pt-0"
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
            previewed={previewedInstanceId === instanceId}
            dragging={dragCard?.instanceId === instanceId}
            affordable={card.cost <= energy}
            disabled={disabled}
            bind={bind(card, instanceId, card.cost)}
          />
        ))}
      </div>

      {dragCard ? (
        <div
          ref={ghostRef}
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-[70] w-24 -translate-x-1/2 -translate-y-[65%] scale-110 opacity-95 drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]"
        >
          <CardView card={dragCard.card} size="xs" />
        </div>
      ) : null}
    </div>
  );
}

interface HandCardItemProps {
  card: Card;
  offsetFromCenter: number;
  marginLeft: number;
  zIndex: number;
  previewed: boolean;
  dragging: boolean;
  affordable: boolean;
  disabled?: boolean;
  bind: {
    onPointerDown: (e: React.PointerEvent) => void;
  };
}

function HandCardItem({
  card,
  offsetFromCenter,
  marginLeft,
  zIndex,
  previewed,
  dragging,
  affordable,
  disabled,
  bind,
}: HandCardItemProps) {
  return (
    <div
      role="listitem"
      className={clsx(
        'relative shrink-0 touch-none transition-transform duration-150 ease-out',
        previewed && '[filter:drop-shadow(0_0_10px_rgba(255,45,85,0.5))]',
        dragging && 'opacity-30',
        !previewed && !dragging && styles.desktopHoverLift,
      )}
      style={{
        marginLeft,
        // Must stay below HandCardPreview's modal (z-50, and a stacking-context sibling here via
        // ArenaSurface's `isolate`) - 100 used to outrank it, letting the previewed card itself
        // intercept clicks on its own preview dialog's Close/Play buttons.
        zIndex: previewed ? 40 : zIndex,
        transform: previewed
          ? 'translateY(-18px) scale(1.06) rotate(0deg)'
          : `translateY(${Math.abs(offsetFromCenter) * ARC_STEP_PX}px) rotate(${offsetFromCenter * ANGLE_STEP_DEG}deg)`,
      }}
      {...bind}
      aria-label={`${card.name}: нажмите для просмотра, зажмите и перетащите на поле чтобы сыграть`}
      data-tutorial-target={HAND_TUTORIAL_TARGET[card.type]}
    >
      <CardView
        card={card}
        size="xs"
        className={clsx(
          'animate-card-in sm:!max-w-[112px] lg:!max-w-[78px] xl:!max-w-[86px]',
          styles.compactHandCard,
          previewed && 'ring-2 ring-raido-red',
          !affordable && 'opacity-40',
          disabled && 'pointer-events-none',
        )}
      />
    </div>
  );
}
