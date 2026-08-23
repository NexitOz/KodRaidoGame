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
  /** Which card (if any) is currently armed for play (`selection.kind === 'hand'` in the parent
   * page) - distinct from `previewedInstanceId`: a drag-armed card never opens the preview modal
   * at all, so without this the dock had no way to visually distinguish it from a resting card
   * once armed (Battlefield Polish 3.1). */
  selectedInstanceId?: string | null;
  disabled?: boolean;
  /** Plain tap: opens/closes the enlarged preview. Never plays the card by itself anymore -
   * playing is press-hold + drag + release onto the battlefield (see `onPlayByDrag`). */
  onTogglePreview: (card: Card, instanceId: string) => void;
  /** Drop resolution from a completed drag: `zone` is the `data-drop-zone` value under the
   * release point (an empty/occupied board slot, a conductor, the general board area), or null
   * if released somewhere that isn't a valid target - callers should treat null as "cancelled". */
  onPlayByDrag: (instanceId: string, cost: number, zone: string | null) => void;
}

interface DensityTier {
  angleStepDeg: number;
  arcStepPx: number;
  overlapPx: number;
  compactName: boolean;
  /** The wrapper row's own `marginLeft` (see the render below) - re-centers the fan's rotated
   * bounding box under `justify-center`, which alone only centers the *unrotated* flex layout box,
   * not what actually paints once rotation pushes each card's visual extent outside it. Kept as its
   * own per-tier value (not derived from `overlapPx`) because the correction isn't proportional to
   * overlap - it was re-measured directly per tier against a real 10-card hand's bounding rects. */
  centerOffsetPx: number;
}

/** Desktop's own numbers, byte-for-byte unchanged - used whenever `!isMobile`, and also mobile's
 * own tier for hands of 5 or fewer (the size every existing mobile screenshot/QA pass was taken
 * at, so that range is intentionally left untouched too). */
const DESKTOP_TIER: DensityTier = { angleStepDeg: 5, arcStepPx: 3, overlapPx: 22, compactName: false, centerOffsetPx: 22 };

/** Mobile-only density tiers (Mobile Battlefield production polish 4.0). Live-measured at
 * 360/390/412/430px against a real 10-card hand: the old fixed desktop-shared numbers produced a
 * fan ~453px wide in a 390px viewport (both edge cards clipped by the viewport, ~20px left / ~42px
 * right) - `getBoundingClientRect` on `[role="listitem"]` before/after every change below. The
 * dominant cause wasn't overlap so much as *rotation*: a ~22.5deg edge-card tilt turns a ~62px-wide
 * card into a ~93px-wide axis-aligned bounding box. Flattening the rotation step for dense hands
 * shrinks that bounding box far more than tightening overlap alone could, so both move together per
 * tier. `compactName` (new `CardView` prop, defaults off everywhere else) drops the below-artwork
 * name row starting at 6+ cards, where it was already overlapping into unreadable noise (measured
 * live - even the lighter 6-7 tier's own overlap still smeared adjacent names together) - the full
 * name is still one tap away via the existing preview modal, and via the engaged-card portal
 * overlay while a card is selected, so no information is actually lost, only the illegible
 * resting-state copy. */
function getMobileDensityTier(handSize: number): DensityTier {
  if (handSize <= 5) return DESKTOP_TIER;
  if (handSize <= 7) return { angleStepDeg: 3, arcStepPx: 2, overlapPx: 32, compactName: true, centerOffsetPx: 0 };
  return { angleStepDeg: 1, arcStepPx: 0.6, overlapPx: 42, compactName: true, centerOffsetPx: 0 };
}

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

/** Mirrors `useDesktopHoverCapable`'s breakpoint (the same `1023.98px` line every other mobile-vs-
 * desktop split in this codebase uses) so the engaged-card escalation overlay below only ever
 * renders on mobile - desktop keeps its existing, approved local-transform escalation completely
 * untouched. */
function useMobileViewport() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 1023.98px)');
    setMobile(mql.matches);
    const onChange = () => setMobile(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);
  return mobile;
}

export function HandFan({
  cards,
  energy,
  previewedInstanceId,
  selectedInstanceId,
  disabled,
  onTogglePreview,
  onPlayByDrag,
}: HandFanProps) {
  const center = (cards.length - 1) / 2;
  // The one card the dock should visually escalate above its neighbors - armed (drag or
  // preview->Play) takes priority since it's the more consequential state, previewed otherwise.
  const engagedId = selectedInstanceId ?? previewedInstanceId ?? null;
  const hoverCapable = useDesktopHoverCapable();
  const isMobile = useMobileViewport();
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

  // Mobile engaged-card escalation overlay: the same "a child can never out-stack content above
  // its own fixed-position ancestor's stacking context" problem the hover overlay above already
  // documents applies just as much to the plain armed state on mobile - `.handSection` sits below
  // `.plyCommanderSlot`/`.resonanceSlot` in z-index, so no local z-index on the in-dock card can
  // ever paint above them, and the dock's own horizontally-scrolling row clips a locally scaled-up
  // edge card the moment it grows past the row's own left/right bound. Both are ancestor problems,
  // so (matching the hover overlay's own fix) this escapes both via the identical `createPortal`
  // technique, fixed + centered with viewport-safe margins so neither an edge nor a center card
  // can ever clip off-screen or land behind the commander/Resonance housings again.
  //
  // Mobile battlefield polish pass: keyed off `selectedInstanceId` only, not `engagedId` (which
  // also includes `previewedInstanceId`) - a plain preview already opens `HandCardPreview`'s own
  // full-size modal, so showing this overlay too painted a second, smaller card directly on top of
  // the modal's own header (cost/title/type row visibly cut off underneath it). The armed state
  // (after tapping "Сыграть" in the modal, or completing a drag) has no modal of its own, so it's
  // the only mobile state that still needs this floating card as its sole "what's about to be
  // played" readout.
  const mobileEngagedEntry =
    isMobile && !dragCard && selectedInstanceId ? cards.find((c) => c.instanceId === selectedInstanceId) : undefined;

  // Mobile-only density tier (Mobile Battlefield production polish 4.0) - `DESKTOP_TIER` is used
  // verbatim whenever `!isMobile`, so desktop's own geometry is untouched byte-for-byte.
  const tier = isMobile ? getMobileDensityTier(cards.length) : DESKTOP_TIER;

  return (
    <div
      className="flex justify-center overflow-x-auto px-2 pb-1 pt-2 lg:overflow-visible lg:px-0 lg:pb-0 lg:pt-0"
      role="list"
      aria-label={`Рука, ${cards.length} карт`}
    >
      <div className="flex" style={{ marginLeft: cards.length > 1 ? tier.centerOffsetPx : 0 }}>
        {cards.map(({ instanceId, card }, i) => (
          <HandCardItem
            key={instanceId}
            card={card}
            offsetFromCenter={i - center}
            marginLeft={i === 0 ? 0 : -tier.overlapPx}
            angleStepDeg={tier.angleStepDeg}
            arcStepPx={tier.arcStepPx}
            compactName={tier.compactName}
            zIndex={i}
            engaged={engagedId === instanceId}
            // The portal overlay below already shows the escalated view on mobile - suppress the
            // in-dock card's own large local scale/lift for that one card so it doesn't also try
            // to grow (and clip) in place. It keeps the ring/glow feedback either way.
            suppressLocalEscalation={Boolean(mobileEngagedEntry) && engagedId === instanceId}
            dimmed={Boolean(engagedId) && engagedId !== instanceId}
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

      {/* Mobile engaged-card escalation overlay (see `mobileEngagedEntry` above for why this
       * exists) - always horizontally centered with a fixed safe margin rather than tracking the
       * original card's own on-screen position, so an edge card and a center card land in
       * exactly the same safe, fully-on-screen spot; there's nothing to clamp because it never
       * inherits an off-screen position to begin with. Bottom-anchored well above the resting
       * dock's own reveal strip and the commander/Resonance band beneath it (both measured live
       * against the mobile `.stage` at every tested viewport - see HandFan.module.css) rather
       * than the hover overlay's desktop-tuned `bottom-8`, which sits far too low for the mobile
       * dock's much larger reserved height. The original in-dock card stays exactly where it was,
       * fully interactive underneath (tap-to-cancel, drag-to-play) - `suppressLocalEscalation`
       * above only mutes its own competing scale/lift, never its hit target. */}
      {mobileEngagedEntry && typeof document !== 'undefined'
        ? createPortal(
            <div
              aria-hidden
              className={clsx(
                'pointer-events-none fixed left-1/2 z-[68] w-[150px] -translate-x-1/2 animate-card-in drop-shadow-[0_20px_40px_rgba(0,0,0,0.75)]',
                styles.engagedOverlay,
              )}
            >
              <CardView
                card={mobileEngagedEntry.card}
                size="sm"
                allowNameWrap
                className="!max-w-[150px] ring-2 ring-raido-red/80"
              />
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
  /** Per-tier resting-fan geometry (see `getMobileDensityTier`) - `DESKTOP_TIER`'s own values on
   * desktop/small mobile hands, flattened for denser mobile hands so the fan's rotated bounding
   * box stops clipping past the viewport edge at 8-10 cards. */
  angleStepDeg: number;
  arcStepPx: number;
  /** Mobile-only, 6+ card hands (see `CardView`'s own `compactName` doc) - the full name is still
   * one tap away via preview/engaged-overlay, so this only ever suppresses illegible resting-state
   * text, never information reachable no other way. */
  compactName: boolean;
  zIndex: number;
  /** True for the one card currently previewed (tap) or armed for play (drag, or preview->Play) -
   * the dock's "escalated" card, visually lifted/scaled/glowing above its neighbors. */
  engaged: boolean;
  /** True for every OTHER card while one is engaged - dimmed on mobile only (Battlefield Polish
   * 3.1: dense 10-13 card hands were hard to read which card was actually selected) so the
   * engaged card reads clearly against its neighbors instead of being swallowed by the overlap.
   * Desktop is unaffected (`lg:opacity-100` resets it), matching the frozen desktop requirement. */
  dimmed: boolean;
  /** True only for the one engaged card, and only on mobile (see `mobileEngagedEntry` in the
   * parent) - the portal overlay already shows the escalated view, so this card's own local
   * transform is muted to a small lift instead of the full scale-up, which is what used to clip
   * off-screen for an edge card in a 10-card fan. Ring/glow feedback stays either way. */
  suppressLocalEscalation: boolean;
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
  angleStepDeg,
  arcStepPx,
  compactName,
  zIndex,
  engaged,
  suppressLocalEscalation,
  dimmed,
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
        styles.cardItem,
        dragging && 'opacity-30',
        // Mobile-only: every card but the engaged one dims a touch so the engaged card reads
        // clearly in a dense 10-13 card fan; `lg:opacity-100` keeps desktop pixel-identical.
        dimmed && !dragging && 'opacity-55 lg:opacity-100',
        !engaged && !dragging && styles.desktopHoverLift,
      )}
      data-engaged={engaged || undefined}
      style={{
        marginLeft,
        // Must stay below HandCardPreview's modal (z-50, and a stacking-context sibling here via
        // ArenaSurface's `isolate`) - 100 used to outrank it, letting the engaged card itself
        // intercept clicks on its own preview dialog's Close/Play buttons.
        zIndex: engaged ? 40 : zIndex,
        // `scale()` reads a CSS custom property (see HandFan.module.css `.cardItem`) so mobile can
        // give the engaged card a stronger pop (Battlefield Polish 3.1) without touching this
        // value at all - the property is only ever defined inside a `max-width:1023.98px` media
        // query, so at desktop `var()`'s fallback (1.06, the original, unchanged literal) applies.
        // `suppressLocalEscalation` (mobile only, see the parent's `mobileEngagedEntry`) trades
        // that scale-up for a small lift only - the portal overlay is what actually escalates the
        // card there, so growing this one too just doubled the visual and was what clipped an
        // edge card off-screen in a dense 10-card fan.
        transform: engaged
          ? suppressLocalEscalation
            ? 'translateY(-6px) scale(1) rotate(0deg)'
            : 'translateY(-18px) scale(var(--hf-engaged-scale, 1.06)) rotate(0deg)'
          : `translateY(${Math.abs(offsetFromCenter) * arcStepPx}px) rotate(${offsetFromCenter * angleStepDeg}deg)`,
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
        compactName={compactName}
        className={clsx(
          'animate-card-in sm:!max-w-[112px] lg:!max-w-[140px] xl:!max-w-[156px]',
          styles.compactHandCard,
          engaged && 'ring-2 ring-raido-red',
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
