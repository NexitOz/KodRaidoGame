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
  /** Whose turn it is right now — a quiet lighting cue only, no new state. */
  active: boolean;
  /** Raw HP shown in the overlapping badge at the medallion's base, echoing the reference's large
   * "28" number under each commander portrait — same `player.conductorHp` ConductorPanel already
   * reads, just presented as the dominant number instead of a small text line. */
  hp: number;
  /** Permanent side identity - opponent reads crimson, player reads blue/violet, independent of
   * whose turn it is (which only brightens the ring further via `active`). */
  side: 'opponent' | 'player';
}

const SIDE_GLOW = {
  opponent: 'bg-raido-red/25',
  player: 'bg-[#8a6fe0]/25',
} as const;
/** Literal (not string-composed) Tailwind classes - the JIT scanner needs the exact class text to
 * appear somewhere in source, so a `.replace('border-', 'text-')` trick on a variant string would
 * silently generate no CSS at all. */
const SIDE_RING_TEXT = {
  opponent: 'text-raido-red/45',
  player: 'text-[#8a6fe0]/50',
} as const;
const SIDE_ACTIVE_RING_TEXT = {
  opponent: 'text-raido-red/80',
  player: 'text-[#a894f0]/85',
} as const;

/**
 * Large circular commander-medallion standing in for a painted hero portrait (Battlefield Visual
 * Upgrade, desktop reference pass) — we have no commissioned character portraits, so this stays a
 * scaled-up version of the existing `Icon` glyph inside an ornate layered gold frame rather than
 * inventing permanent character art or binding flagship card art to player identity. Visual space
 * (the frame itself) is already sized/positioned for real commander art to drop into later. HP is
 * folded into an overlapping badge at the base of the medallion (matching the reference's large HP
 * number under each portrait) instead of a separate bar/text row.
 */
export function HeroFrame({ icon, low, targetable, rank, impactKey, damaged, healed, active, hp, side }: HeroFrameProps) {
  return (
    <span className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center sm:h-16 sm:w-16 lg:h-28 lg:w-28">
      {/* Ambient side-color glow - permanent identity, brightens further when active. */}
      <span
        aria-hidden
        className={clsx(
          'pointer-events-none absolute inset-0 rounded-full blur-xl transition-opacity duration-700',
          SIDE_GLOW[side],
          active ? 'opacity-100 animate-arena-breathe' : 'opacity-40',
        )}
      />

      {/* Outer engraved ring with tick marks - the layered "premium frame" the request asked for. */}
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        className={clsx('pointer-events-none absolute inset-0 h-full w-full', active ? SIDE_ACTIVE_RING_TEXT[side] : SIDE_RING_TEXT[side])}
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
      <span aria-hidden className="pointer-events-none absolute inset-2.5 rounded-full border border-raido-gold/25" />
      <span aria-hidden className="pointer-events-none absolute inset-[14px] rounded-full border border-raido-gold/10" />

      <span
        key={impactKey}
        aria-hidden
        className={clsx(
          'relative z-10 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-raido-graphite to-raido-black text-raido-white ring-1 sm:h-12 sm:w-12 lg:h-[5.75rem] lg:w-[5.75rem]',
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

      {/* HP badge overlapping the base of the medallion - the dominant, at-a-glance number. */}
      <span
        className={clsx(
          'absolute -bottom-1.5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-full border-2 bg-raido-black px-2 py-0.5 text-[10px] font-black tabular-nums shadow-[0_3px_10px_rgba(0,0,0,0.7)] lg:-bottom-2.5 lg:gap-1.5 lg:px-3.5 lg:py-1 lg:text-base lg:text-lg',
          low ? 'border-raido-red/70 text-raido-redGlow' : 'border-raido-gold/50 text-raido-white',
        )}
      >
        <Icon name="heart" size={15} />
        {hp}
      </span>
    </span>
  );
}
