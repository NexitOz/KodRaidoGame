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
}

/**
 * Premium arched/circular portrait frame for the Conductor icon-circle. Purely a presentation
 * wrapper around the same `Icon`/rank badge/impact-shake logic `ConductorPanel` already owns — it
 * does not invent permanent character portraits or bind flagship card art to player identity
 * (Battlefield Visual Foundation, Phase A, constraint: hero areas stay faction-neutral/Raido-branded
 * since no player-level faction signal exists in `PlayerStateView`).
 */
export function HeroFrame({ icon, low, targetable, rank, impactKey, damaged, healed, active }: HeroFrameProps) {
  return (
    <span className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center">
      {/* Outer engraved ring - brightens gently on the active player's turn. */}
      <span
        aria-hidden
        className={clsx(
          'pointer-events-none absolute inset-0 rounded-full border transition-colors duration-700',
          active ? 'border-raido-red/50' : 'border-white/10',
        )}
      />
      {active ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full blur-[3px] animate-arena-breathe bg-raido-red/15"
        />
      ) : null}

      <span
        key={impactKey}
        aria-hidden
        className={clsx(
          'relative z-10 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-raido-black text-raido-white ring-1',
          low ? 'ring-raido-red/50' : 'ring-white/10',
          targetable && 'ring-2 ring-emerald-400/60',
          impactKey > 0 && (damaged ? 'animate-shake-hit' : healed ? 'animate-flash-hit' : ''),
        )}
      >
        <Icon name={icon} size={20} />
        {rank ? (
          <span
            className="absolute -bottom-1 -right-1 rounded-full border border-raido-black bg-raido-steel px-1 text-[9px] font-bold uppercase text-raido-gold"
            title={rank.label}
          >
            {rank.tier.slice(0, 2)}
          </span>
        ) : null}
      </span>
    </span>
  );
}
