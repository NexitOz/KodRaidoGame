'use client';

import clsx from 'clsx';
import { Icon, type IconName } from '@kod-raido/ui';

export interface HeroFrameProps {
  icon: IconName;
  low: boolean;
  targetable: boolean;
  rank?: { tier: string; label: string };
  impactKey: number;
  damaged: boolean;
  healed: boolean;
  active: boolean;
  hp: number;
  side: 'opponent' | 'player';
}

const SIDE_GLOW = {
  opponent: 'bg-raido-red/25',
  player: 'bg-[#8a6fe0]/25',
} as const;
const SIDE_RING_TEXT = {
  opponent: 'text-raido-red/45',
  player: 'text-[#8a6fe0]/50',
} as const;
const SIDE_ACTIVE_RING_TEXT = {
  opponent: 'text-raido-red/80',
  player: 'text-[#a894f0]/85',
} as const;
const MOBILE_COMMANDER_ART = {
  opponent: '/art/battlefield/mobile-controls/kod-raido-mobile-commander-opponent-v1.webp',
  player: '/art/battlefield/mobile-controls/kod-raido-mobile-commander-player-v1.webp',
} as const;
// QA fix (Task 5.1): a 1x1 transparent placeholder for the always-present `<img>` inside the
// `<picture>` below - same technique DeckPile/DiscardPile already use, so the real mobile WebP is
// requested only when the `(max-width: 1023.98px)` `<source>` actually matches, instead of a plain
// `<img src>` that Chromium fetches unconditionally regardless of the `lg:hidden` CSS class hiding
// it (a CSS display:none never stops an already-issued image fetch).
const TRANSPARENT_PIXEL = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';

export function HeroFrame({ icon, low, targetable, rank, impactKey, damaged, healed, active, hp, side }: HeroFrameProps) {
  return (
    <span className="relative flex h-[70px] w-[62px] flex-shrink-0 items-center justify-center sm:h-[76px] sm:w-[68px] lg:h-28 lg:w-28">
      <picture key={`mobile-commander-${impactKey}`} className="pointer-events-none absolute inset-0 lg:hidden" aria-hidden="true">
        <source media="(max-width: 1023.98px)" srcSet={MOBILE_COMMANDER_ART[side]} />
        <img
          src={TRANSPARENT_PIXEL}
          alt=""
          draggable={false}
          width={129}
          height={160}
          className={clsx(
            'h-full w-full object-contain',
            active ? 'drop-shadow-[0_0_10px_rgba(255,255,255,0.18)]' : 'opacity-95',
            impactKey > 0 && (damaged ? 'animate-shake-hit' : healed ? 'animate-flash-hit' : ''),
          )}
        />
      </picture>
      {targetable ? (
        <span aria-hidden className="pointer-events-none absolute inset-[12%] z-10 rounded-full ring-2 ring-emerald-400/75 lg:hidden" />
      ) : null}
      {/* Mobile battlefield polish pass: a small dark pill behind the HP figure (same "rounded
       * pill on the medallion" language the `rank` badge just below already uses on this same
       * component) instead of bare shadowed text - gives the commander's one piece of live combat
       * state the same "framed" weight as the Resonance panel beside it, without moving its own
       * anchor point (`bottom-[7%] left-[61%]`, tuned to a specific clear spot on the painted
       * medallion, is unchanged) or growing large enough to cover any of the art around it. */}
      <span
        className={clsx(
          'pointer-events-none absolute bottom-[7%] left-[61%] z-20 -translate-x-1/2 rounded-full px-1.5 py-0.5 text-[9px] font-black tabular-nums shadow-[0_1px_4px_rgba(0,0,0,0.85)] lg:hidden',
          low
            ? 'bg-raido-black/70 text-raido-redGlow ring-1 ring-raido-red/45'
            : 'bg-raido-black/70 text-white ring-1 ring-[#c9a35f]/40',
        )}
      >
        {hp}
      </span>
      {rank ? (
        <span
          className="pointer-events-none absolute right-[4%] top-[6%] z-20 rounded-full bg-raido-black/80 px-1 py-0.5 text-[7px] font-bold uppercase text-raido-gold lg:hidden"
          title={rank.label}
        >
          {rank.tier.slice(0, 2)}
        </span>
      ) : null}

      <span
        aria-hidden
        className={clsx(
          'pointer-events-none absolute inset-0 hidden rounded-full blur-xl transition-opacity duration-700 lg:block',
          SIDE_GLOW[side],
          active ? 'opacity-100 animate-arena-breathe' : 'opacity-40',
        )}
      />
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        className={clsx(
          'pointer-events-none absolute inset-0 hidden h-full w-full lg:block',
          active ? SIDE_ACTIVE_RING_TEXT[side] : SIDE_RING_TEXT[side],
        )}
      >
        <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="1.2" fill="none" />
        {Array.from({ length: 20 }).map((_, i) => {
          const angle = (i / 20) * 2 * Math.PI;
          const x1 = 50 + Math.cos(angle) * 45;
          const y1 = 50 + Math.sin(angle) * 45;
          const x2 = 50 + Math.cos(angle) * 48;
          const y2 = 50 + Math.sin(angle) * 48;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1" />;
        })}
      </svg>
      <span aria-hidden className="pointer-events-none absolute inset-2.5 hidden rounded-full border border-raido-gold/25 lg:block" />
      <span aria-hidden className="pointer-events-none absolute inset-[14px] hidden rounded-full border border-raido-gold/10 lg:block" />

      <span
        key={impactKey}
        aria-hidden
        className={clsx(
          'relative z-10 hidden h-[5.75rem] w-[5.75rem] flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-raido-graphite to-raido-black text-raido-white ring-1 lg:flex',
          low ? 'ring-raido-red/60' : 'ring-white/10',
          targetable && 'ring-2 ring-emerald-400/70',
          impactKey > 0 && (damaged ? 'animate-shake-hit' : healed ? 'animate-flash-hit' : ''),
        )}
      >
        <Icon name={icon} size={30} />
        {rank ? (
          <span
            className="absolute -right-1 -top-1 rounded-full border border-raido-black bg-raido-steel px-1.5 py-0.5 text-[10px] font-bold uppercase text-raido-gold"
            title={rank.label}
          >
            {rank.tier.slice(0, 2)}
          </span>
        ) : null}
      </span>

      <span
        className={clsx(
          'absolute -bottom-2.5 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-1.5 rounded-full border-2 bg-raido-black px-3.5 py-1 text-lg font-black tabular-nums shadow-[0_3px_10px_rgba(0,0,0,0.7)] lg:flex',
          low ? 'border-raido-red/70 text-raido-redGlow' : 'border-raido-gold/50 text-raido-white',
        )}
      >
        <Icon name="heart" size={15} />
        {hp}
      </span>
    </span>
  );
}
