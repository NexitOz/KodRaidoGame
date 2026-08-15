'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import type { Card } from '@kod-raido/shared';
import { CardView, factionAccent } from '@kod-raido/ui';
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

/** Desktop-only: the compact bottom dock (see `.handSection` in MatchBoard.module.css) deliberately
 * keeps `.plyCommanderSlot`/`.resonanceSlot` above the *resting* hand's z-index so they're never
 * covered - which means a card lifted only via its own (locally-scoped) z-index can never paint
 * above them either, no matter how high that local value is: a descendant can't out-stack content
 * above its own stacking-context-creating ancestor. The fix is this hook + the portal render below
 * it, not a bigger z-index - `createPortal`ing the engaged card straight into `document.body`
 * escapes `.handSection`'s stacking context entirely, the same trick the existing drag ghost
 * already relied on (now also portaled, for the same reason - it had the identical bug mid-drag). */
function useDesktopHoverCapable() {
  const [capable, setCapable] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1024px)');
    setCapable(mql.matches);
    const onChange = () => setCapable(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);
  return capable;
}

export function HandFan({
  cards,
  energy,
  previewedInstanceId,
  disabled,
  onTogglePreview,
  onPlayByDrag,
}: HandFanProps) {
  const center = (cards.length - 1) / 2;
  const hoverCapable = useDesktopHoverCapable();
  const [hoveredInstanceId, setHoveredInstanceId] = useState<string | null>(null);

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

  // Only one card can be "engaged" (visually escalated above the commander/Resonance via the
  // portal below) at a time, and dragging always wins - the drag ghost already covers that case.
  const hoveredEntry =
    hoverCapable && !dragCard && hoveredInstanceId && previewedInstanceId !== hoveredInstanceId
      ? cards.find((c) => c.instanceId === hoveredInstanceId)
      : undefined;

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
            onHoverChange={hoverCapable ? (hovering) => setHoveredInstanceId(hovering ? instanceId : null) : undefined}
          />
        ))}
      </div>

      {dragCard && typeof document !== 'undefined'
        ? createPortal(
            <div
              ref={ghostRef}
              aria-hidden
              className="pointer-events-none fixed left-0 top-0 z-[70] w-24 -translate-x-1/2 -translate-y-[65%] scale-110 opacity-95 drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]"
            >
              <CardView card={dragCard.card} size="xs" />
            </div>,
            document.body,
          )
        : null}

      {/* Hover escalation overlay - a real `createPortal` into `document.body`, not a bigger
       * z-index on the in-dock card (see the hook comment above for why that can't work). Fixed,
       * bottom-anchored well clear of the dock line so the whole card - art, name, type/rarity,
       * ATK/HP - is guaranteed to fit inside the shortest supported viewport (measured 650px tall)
       * with room to spare, regardless of the dock's own tight reveal budget. Widened past
       * `size="sm"`'s own 140px cap (same `!` override pattern as the dock cards' own width in
       * HandCardItem below) and `allowNameWrap` opted in - together they cover names too long for
       * one line at any reasonable width, which a wider box alone can't guarantee. The original
       * card stays exactly where it was in the dock underneath; this is purely an additional,
       * read-only visual (`pointer-events-none`) - all real interaction (drag-to-play,
       * tap-to-preview) still targets the original card. */}
      {hoveredEntry && typeof document !== 'undefined'
        ? createPortal(
            <div
              aria-hidden
              className="pointer-events-none fixed bottom-8 left-1/2 z-[65] w-[190px] -translate-x-1/2 animate-card-in drop-shadow-[0_20px_40px_rgba(0,0,0,0.7)]"
            >
              <CardView card={hoveredEntry.card} size="sm" allowNameWrap className="!max-w-[190px] ring-2 ring-raido-red/70" />
            </div>,
            document.body,
          )
        : null}
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
  /** Desktop-only (undefined on mobile/coarse pointers - see `useDesktopHoverCapable`); drives the
   * `createPortal`-based hover escalation in the parent, not a local CSS `:hover` lift - see the
   * comment above that hook for why a purely local lift can't paint above the commander/Resonance
   * from inside the dock's own stacking context. */
  onHoverChange?: (hovering: boolean) => void;
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
  onHoverChange,
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
      onMouseEnter={onHoverChange ? () => onHoverChange(true) : undefined}
      onMouseLeave={onHoverChange ? () => onHoverChange(false) : undefined}
      aria-label={`${card.name}: нажмите для просмотра, зажмите и перетащите на поле чтобы сыграть`}
      data-tutorial-target={HAND_TUTORIAL_TARGET[card.type]}
    >
      <CardView
        card={card}
        size="xs"
        className={clsx(
          'animate-card-in sm:!max-w-[112px] lg:!max-w-[140px] xl:!max-w-[156px]',
          styles.compactHandCard,
          previewed && 'ring-2 ring-raido-red',
          !affordable && 'opacity-40',
          disabled && 'pointer-events-none',
        )}
      />
      {/* `CardView`'s own `size="xs"` layout has no faction indicator at all (only non-xs sizes get
       * one) - at rest the dock only shows each card's top slice, so the cost badge alone doesn't
       * convey faction. Added here instead of in the shared component so mobile (which reuses the
       * same `size="xs"` CardView unchanged) is unaffected - `hidden lg:flex` keeps this purely a
       * desktop-dock addition. */}
      <span
        aria-hidden
        className={clsx(
          'pointer-events-none absolute right-1.5 top-1.5 z-10 hidden h-4 w-4 items-center justify-center rounded-full bg-black/70 text-[10px] ring-1 ring-white/10 lg:flex',
          factionAccent(card.faction).textClass,
        )}
      >
        {factionAccent(card.faction).glyph}
      </span>
    </div>
  );
}
