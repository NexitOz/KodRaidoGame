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

const ASSET_SRC = '/art/battlefield/controls/kod-raido-end-turn-master.webp';
const MOBILE_CONTROL_PATH = '/art/battlefield/mobile-controls';
const MOBILE_END_TURN = {
  active: `${MOBILE_CONTROL_PATH}/kod-raido-mobile-end-turn-active-v1.webp`,
  idle: `${MOBILE_CONTROL_PATH}/kod-raido-mobile-end-turn-idle-v1.webp`,
  disabled: `${MOBILE_CONTROL_PATH}/kod-raido-mobile-end-turn-disabled-v1.webp`,
} as const;
// QA fix (Task 5.1): same reasoning as HeroFrame.tsx - a `<picture>` with a `(max-width:
// 1023.98px)` `<source>` only fetches whichever mobile asset `mobileAsset` currently points to
// when that media query actually matches; the previous plain `<img src={mobileAsset}>` (hidden via
// `lg:hidden` CSS only) was fetched by the browser regardless of viewport width.
const TRANSPARENT_PIXEL = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';

const LENS_DIAMETER_PERCENT = 54;
const CENTER_X_PERCENT = 50 + (-11.5 / 250.8) * 100;
const CENTER_Y_PERCENT = 50 + (34.5 / 159.97) * 100;
const MECHANISM_WIDTH_PERCENT = (280 / 250.8) * 100;

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
  const mechanismScale = visual === 'hover' ? 1.02 : visual === 'pressed' ? 0.957 : 1;
  const mobileAsset = pending ? MOBILE_END_TURN.idle : ready ? MOBILE_END_TURN.active : MOBILE_END_TURN.disabled;

  const scaleVar = {
    '--et-scale': mechanismScale,
    '--et-press-ty': pressed ? '1.5px' : '0px',
    '--et-mech-w': `${MECHANISM_WIDTH_PERCENT}%`,
    '--et-lens-w': `${(MECHANISM_WIDTH_PERCENT * LENS_DIAMETER_PERCENT) / 100}%`,
    '--et-left': `${CENTER_X_PERCENT}%`,
    '--et-top': `${CENTER_Y_PERCENT}%`,
  } as React.CSSProperties;

  return (
    <div className={clsx('relative flex h-full w-full items-center justify-center', className)} style={scaleVar}>
      <picture className="pointer-events-none absolute inset-0 lg:hidden" aria-hidden="true">
        <source media="(max-width: 1023.98px)" srcSet={mobileAsset} />
        <img
          src={TRANSPARENT_PIXEL}
          alt=""
          draggable={false}
          width={96}
          height={95}
          className={clsx(
            'h-full w-full object-contain',
            ready && 'drop-shadow-[0_0_10px_rgba(239,68,68,0.55)]',
            pending && 'animate-pulse-rune opacity-85',
            pressed && !isDesktop && 'scale-[0.96] transition-transform duration-100',
          )}
        />
      </picture>

      {isDesktop ? (
        <img
          src={ASSET_SRC}
          alt=""
          aria-hidden="true"
          draggable={false}
          className={clsx(
            'pointer-events-none absolute hidden aspect-square',
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
        aria-label={pending ? 'Обработка…' : 'Завершить ход'}
        data-tutorial-target="end-turn"
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => {
          setHovered(false);
          setPressed(false);
        }}
        onPointerDown={() => setPressed(true)}
        onPointerUp={() => setPressed(false)}
        className={clsx(
          'relative z-10 flex !h-[62%] !w-[62%] !min-h-0 flex-col items-center justify-center rounded-full !p-0 text-transparent transition-transform duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-raido-gold/80 focus-visible:ring-offset-2 focus-visible:ring-offset-raido-black disabled:cursor-not-allowed lg:gap-0.5 lg:text-[10.6px] lg:leading-[1.15] lg:tracking-normal lg:text-inherit',
          pressed && !isDesktop && 'scale-[0.96]',
          'lg:!absolute lg:!h-[var(--et-lens-w)] lg:!w-[var(--et-lens-w)] lg:!min-w-0 lg:!left-[var(--et-left)] lg:!top-[var(--et-top)] lg:border-0 lg:bg-transparent lg:shadow-none lg:focus-visible:ring-raido-gold',
          BUTTON_TRANSFORM_CLASS,
          'lg:transition-transform lg:duration-150 lg:ease-out',
          'motion-reduce:lg:!transition-none',
          POSTURE_TRANSFORM_REDUCED_MOTION_CLASS,
        )}
      >
        <span
          aria-hidden
          className={clsx(
            'pointer-events-none absolute inset-0 hidden rounded-full lg:block',
            pending && 'animate-arena-breathe',
          )}
          style={{ backgroundColor: lens.tint, mixBlendMode: lens.blend, opacity: lens.opacity }}
        />
        {pressed ? (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 hidden rounded-full lg:block"
            style={{ backgroundColor: 'rgba(0,0,0,0.09)', mixBlendMode: 'multiply' }}
          />
        ) : null}

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
