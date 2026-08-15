'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { cormorantSC } from '@/fonts/cormorant-sc';

export interface EndTurnArtifactProps {
  onClick: () => void;
  disabled: boolean;
  pending: boolean;
  isMyTurn: boolean;
  className?: string;
}

// The single approved production asset - a complete finished mechanism (gold body, outer rings,
// ornaments, gems, sapphire lens, glow already painted in). Never cropped, never redrawn.
const ASSET_SRC = '/art/battlefield/controls/kod-raido-end-turn-master.webp';

// Measured directly against the source pixels (image-to-code analysis, not eyeballed): sampling
// the alpha-weighted RGB along 6 radii from the image center, the dark-sapphire lens core gives
// way to the gold ring's warm tones starting at r ~= 54.5% of the half-canvas radius (closest
// transition found, at angle=60deg) and no later than ~59% on any sampled angle. 54% keeps the
// button safely inside the lens on every angle checked, never touching the gold body. This ratio
// is measured on the master art itself (flat, before the perspective posture below), so it holds
// regardless of how the mechanism is tilted to sit in the housing.
const LENS_DIAMETER_PERCENT = 54;

/**
 * Perspective posture: visually confirmed by the owner at 1366x650/1600x720/1920x1080 - do not
 * change the transform constants or the CENTER_ / MECHANISM_WIDTH_PERCENT figures below without a
 * fresh pixel calibration pass, they're tuned to the painted socket in
 * `kod-raido-arena-base.webp` (1672x941 stage) directly beneath `.endTurnSlot`: outer ring edges
 * sampled via horizontal/vertical scanlines through its center land at x:[1370,1650],
 * y:[330,549], i.e. an outer diameter of ~280x219, center (1510,439.5) - about 11.5px left and
 * 34.5px below `.endTurnSlot`'s own CSS anchor (91%/43% of the stage), height/width ratio ~0.78
 * vs. the CSS box's own 0.64. `rotateX` alone at a plausible table-tilt angle only accounts for
 * part of that (cos(19deg) = 0.945); the rest is folded into an explicit `scaleY`.
 *
 * Every size/position figure below is expressed as a plain percentage of `.endTurnSlot` itself
 * (250.8x159.97px at the 1672x941 native stage: 15%/17% of it) rather than referencing
 * `--arena-w` directly - a `%` embedded inside one CSS custom property gets RE-resolved against
 * whatever element finally consumes it via `var()`, not the element that declared it, so reusing
 * `--arena-w`'s own `min(100%, ...)` this deep in the tree silently resolved `100%` against this
 * component's own (much smaller) box instead of the stage. Plain percentages on `width`/`left`/
 * `top` don't have that problem - `.endTurnSlot` already tracks the stage at every viewport, so
 * percentages of it do too, without touching MatchBoard.module.css.
 */
// Ring center vs. `.endTurnSlot`'s own center (50%/50%), in percent of the slot's own box.
const CENTER_X_PERCENT = 50 + (-11.5 / 250.8) * 100; // ~45.41%
const CENTER_Y_PERCENT = 50 + (34.5 / 159.97) * 100; // ~71.57%
// Pre-transform (flat) width of the mechanism as a percent of `.endTurnSlot`'s own width: the
// measured outer-ring diameter (~280px) before the squash below is applied, i.e. the size the art
// must be laid out at so it lands on the ring after tilting.
const MECHANISM_WIDTH_PERCENT = (280 / 250.8) * 100; // ~111.65%

// Tailwind's JIT compiler only ever sees literal text in the source file, never a runtime string -
// composing this class from constants via a template literal produced a class the *element*
// carried but Tailwind never emitted a rule for (silently inert). Written out literally instead:
// `perspective(1000px) rotateX(19deg) scaleY(0.83)` is the posture above. The decorative art and
// the hit-zone need the identical base chain, so both reference it via these constants; the
// button additionally appends the interactive scale and a press-only micro-translate, which the
// img never gets (the outer gold housing doesn't sink on press, only the inner lens does).
const IMG_TRANSFORM_CLASS =
  'lg:[transform:translate(-50%,-50%)_perspective(1000px)_rotateX(19deg)_scaleY(0.83)_scale(var(--et-scale))]';
const BUTTON_TRANSFORM_CLASS =
  'lg:[transform:translate(-50%,-50%)_perspective(1000px)_rotateX(19deg)_scaleY(0.83)_scale(var(--et-scale))_translateY(var(--et-press-ty))]';
const POSTURE_TRANSFORM_REDUCED_MOTION_CLASS =
  'motion-reduce:lg:[transform:translate(-50%,-50%)_perspective(1000px)_rotateX(19deg)_scaleY(0.83)]';

type Visual = 'ready' | 'hover' | 'pressed' | 'pending' | 'disabled';

const LENS: Record<Visual, { tint: string; blend: React.CSSProperties['mixBlendMode']; opacity: number }> = {
  ready: { tint: 'rgba(80,140,255,0.22)', blend: 'color', opacity: 1 },
  hover: { tint: 'rgba(110,170,255,0.32)', blend: 'color', opacity: 1 },
  pressed: { tint: 'rgba(30,70,170,0.4)', blend: 'color', opacity: 1 },
  pending: { tint: 'rgba(255,190,90,0.3)', blend: 'color', opacity: 1 },
  disabled: { tint: 'rgba(10,15,25,0.55)', blend: 'normal', opacity: 1 },
};

const IMG_FILTER: Record<Visual, string | undefined> = {
  ready: undefined,
  hover: undefined,
  pressed: undefined,
  pending: 'brightness(0.92)',
  disabled: 'brightness(0.72) saturate(0.7)',
};

// Ivory-gold, bold Cormorant SC, a stronger dark shadow so the two-line label reads clearly
// against the bright sapphire lens (owner's readability pass) - shared by every label state.
const LABEL_STYLE: React.CSSProperties = {
  fontWeight: 700,
  color: '#f3e6c4',
  textShadow: '0 1px 5px rgba(0,0,0,0.95), 0 0 3px rgba(0,0,0,0.9)',
};

export function EndTurnArtifact({ onClick, disabled, pending, isMyTurn, className }: EndTurnArtifactProps) {
  const ready = isMyTurn && !pending;
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)');
    setIsDesktop(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  const visual: Visual = pending ? 'pending' : !ready ? 'disabled' : pressed ? 'pressed' : hovered ? 'hover' : 'ready';
  const lens = LENS[visual];
  // Pressed is deliberately a bit more assertive than a hover-level nudge - scale dips further
  // (0.955-0.96) and the lens sinks an extra 1-2px in its own plane (--et-press-ty below),
  // distinct from the outer housing, which only ever shares the scale.
  const mechanismScale = visual === 'hover' ? 1.02 : visual === 'pressed' ? 0.957 : 1;

  const scaleVar = {
    '--et-scale': mechanismScale,
    '--et-press-ty': pressed ? '1.5px' : '0px',
    '--et-mech-w': `${MECHANISM_WIDTH_PERCENT}%`,
    '--et-lens-w': `${(MECHANISM_WIDTH_PERCENT * LENS_DIAMETER_PERCENT) / 100}%`,
    // Desktop-only anchor for the img/button below. A plain (unprefixed) inline `left`/`top`
    // would apply at every breakpoint - the button below still carries the base `relative`
    // class at mobile (needed for its own z-index stacking), and `position:relative` honors
    // left/top as an offset from its normal flow position, which is exactly what shifted the
    // mobile pill out of its housing when this was tried as a plain inline style. Routing it
    // through a custom property referenced only by a `lg:` class keeps it desktop-only.
    '--et-left': `${CENTER_X_PERCENT}%`,
    '--et-top': `${CENTER_Y_PERCENT}%`,
  } as React.CSSProperties;

  return (
    <div className={clsx('relative flex h-full w-full items-center justify-center', className)} style={scaleVar}>
      {/* Mobile ambient glow (unchanged - mobile keeps its own pre-existing pill, untouched). */}
      {ready ? (
        <span aria-hidden className="pointer-events-none absolute inset-0 rounded-full blur-md animate-arena-breathe bg-raido-red/25 lg:hidden" />
      ) : null}
      {pending ? (
        <span aria-hidden className="pointer-events-none absolute inset-0 rounded-full blur-md animate-arena-breathe bg-amber-400/20 lg:hidden" />
      ) : null}

      {/* --- Desktop-only decorative mechanism: the full approved master artwork, untouched,
          tilted into the arena's own painted perspective. Both this element and the button below
          are positioned at the identical CENTER_X_PERCENT/CENTER_Y_PERCENT anchor (the painted
          ring's real center, not the slot's own 50%/50%) and share the identical base posture, so
          they stay visually locked - only their pre-transform size differs (full mechanism vs.
          the inner lens only), and only the button additionally sinks on press. */}
      {isDesktop ? (
        <img
          src={ASSET_SRC}
          alt=""
          aria-hidden="true"
          draggable={false}
          className={clsx(
            'pointer-events-none absolute hidden aspect-square',
            // Tailwind's preflight resets `img { max-width: 100% }`, which silently clamped this
            // element back down to the housing's own width even with an explicit larger `width`
            // set - the mechanism needs to be wider than `.endTurnSlot` itself (~112%) to land on
            // the painted ring, so that reset has to be lifted here.
            'lg:!block lg:!max-w-none lg:!w-[var(--et-mech-w)] lg:!left-[var(--et-left)] lg:!top-[var(--et-top)]',
            IMG_TRANSFORM_CLASS,
            'lg:transition-transform lg:duration-150 lg:ease-out',
            'motion-reduce:lg:!transition-none',
            POSTURE_TRANSFORM_REDUCED_MOTION_CLASS,
          )}
          style={{ filter: IMG_FILTER[visual] }}
        />
      ) : null}

      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        data-tutorial-target="end-turn"
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => {
          setHovered(false);
          setPressed(false);
        }}
        onPointerDown={() => setPressed(true)}
        onPointerUp={() => setPressed(false)}
        className={clsx(
          'relative z-10 flex !h-[62%] !w-[62%] !min-h-0 flex-col items-center justify-center whitespace-normal break-words rounded-full !p-0.5 text-[7px] font-black uppercase leading-[1.1] tracking-tight shadow-[inset_0_2px_6px_rgba(0,0,0,0.5)] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-raido-black disabled:cursor-not-allowed',
          ready && 'bg-raido-red text-raido-white shadow-glow border-2 border-raido-gold/50 focus-visible:ring-raido-red',
          !ready && !pending && 'bg-[#1c1830] border-2 border-[#8a6fe0]/30 text-[#c9bdf0]',
          pending && 'bg-amber-900/60 border-2 border-amber-400/50 text-amber-50',
          // Desktop: transparent hit-zone over the master art's own sapphire lens only - the outer
          // gold body is not part of the button and is not clickable. Same base posture as the
          // img above, plus its own press-only micro-translate, so the hit area is tilted into
          // the identical projection as what's drawn on screen. Text size bumped ~25% (8.5px ->
          // 11px) per the owner's readability pass.
          'lg:!absolute lg:!h-[var(--et-lens-w)] lg:!w-[var(--et-lens-w)] lg:!min-w-0 lg:!left-[var(--et-left)] lg:!top-[var(--et-top)] lg:border-0 lg:bg-transparent lg:shadow-none lg:gap-0.5 lg:rounded-full lg:text-[10.6px] lg:leading-[1.15] lg:tracking-normal lg:focus-visible:ring-raido-gold',
          BUTTON_TRANSFORM_CLASS,
          'lg:transition-transform lg:duration-150 lg:ease-out',
          'motion-reduce:lg:!transition-none',
          POSTURE_TRANSFORM_REDUCED_MOTION_CLASS,
        )}
      >
        {/* Lens tint - illuminates the painted sapphire glass via mix-blend-mode, never paints a
            flat colored circle over it (the art's own texture and highlights stay visible). */}
        <span
          aria-hidden
          className={clsx(
            'pointer-events-none absolute inset-0 hidden rounded-full lg:block',
            pending && 'animate-arena-breathe',
          )}
          style={{ backgroundColor: lens.tint, mixBlendMode: lens.blend, opacity: lens.opacity }}
        />
        {/* Extra press-only darkening (~9%) - a plain black multiply layer, not a new shape or
            border, confined to the lens's own already-round box. */}
        {pressed ? (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 hidden rounded-full lg:block"
            style={{ backgroundColor: 'rgba(0,0,0,0.09)', mixBlendMode: 'multiply' }}
          />
        ) : null}

        <span className={clsx('lg:hidden', cormorantSC.className)}>{pending ? 'Обработка…' : 'Завершить ход'}</span>
        {pending ? (
          <span className={clsx('relative hidden lg:block', cormorantSC.className)} style={LABEL_STYLE}>
            ОБРАБОТКА…
          </span>
        ) : (
          <>
            <span
              className={clsx('relative hidden lg:block', cormorantSC.className)}
              style={{ ...LABEL_STYLE, transform: pressed ? 'translateY(1.5px)' : undefined }}
            >
              ЗАВЕРШИТЬ
            </span>
            <span
              className={clsx('relative hidden lg:block', cormorantSC.className)}
              style={{ ...LABEL_STYLE, transform: pressed ? 'translateY(1.5px)' : undefined }}
            >
              ХОД
            </span>
          </>
        )}
      </button>
    </div>
  );
}
