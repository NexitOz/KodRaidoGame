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
}

/**
 * Large circular commander-medallion standing in for a painted hero portrait (Battlefield Visual
 * Upgrade, desktop reference pass) — we have no commissioned character portraits, so this stays a
 * scaled-up version of the existing `Icon` glyph inside an ornate gold ring rather than inventing
 * permanent character art or binding flagship card art to player identity. HP is folded into an
 * overlapping badge at the base of the medallion (matching the reference's large HP number under
 * each portrait) instead of a separate bar/text row.
 */
export function HeroFrame({ icon, low, targetable, rank, impactKey, damaged, healed, active, hp }: HeroFrameProps) {
  return (
    <span className="relative flex h-20 w-20 flex-shrink-0 items-center justify-center lg:h-24 lg:w-24">
      {/* Outer engraved ring - brightens gently on the active player's turn. */}
      <span
        aria-hidden
        className={clsx(
          'pointer-events-none absolute inset-0 rounded-full border-2 transition-colors duration-700',
          active ? 'border-raido-red/60' : 'border-raido-gold/25',
        )}
      />
      <span aria-hidden className="pointer-events-none absolute inset-1.5 rounded-full border border-raido-gold/15" />
      {active ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full blur-[5px] animate-arena-breathe bg-raido-red/20"
        />
      ) : null}

      <span
        key={impactKey}
        aria-hidden
        className={clsx(
          'relative z-10 flex h-[4.25rem] w-[4.25rem] flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-raido-graphite to-raido-black text-raido-white ring-1 lg:h-[5.25rem] lg:w-[5.25rem]',
          low ? 'ring-raido-red/60' : 'ring-white/10',
          targetable && 'ring-2 ring-emerald-400/70',
          impactKey > 0 && (damaged ? 'animate-shake-hit' : healed ? 'animate-flash-hit' : ''),
        )}
      >
        <Icon name={icon} size={34} />
        {rank ? (
          <span
            className="absolute -right-1 -top-1 rounded-full border border-raido-black bg-raido-steel px-1.5 py-0.5 text-[9px] font-bold uppercase text-raido-gold"
            title={rank.label}
          >
            {rank.tier.slice(0, 2)}
          </span>
        ) : null}
      </span>

      {/* HP badge overlapping the base of the medallion - the dominant, at-a-glance number. */}
      <span
        className={clsx(
          'absolute -bottom-2 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-full border-2 bg-raido-black px-2.5 py-0.5 text-sm font-black tabular-nums shadow-[0_2px_8px_rgba(0,0,0,0.6)]',
          low ? 'border-raido-red/70 text-raido-redGlow' : 'border-raido-gold/40 text-raido-white',
        )}
      >
        <Icon name="heart" size={12} />
        {hp}
      </span>
    </span>
  );
}
