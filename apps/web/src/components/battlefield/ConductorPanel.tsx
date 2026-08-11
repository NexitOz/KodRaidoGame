'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import {
  STARTING_CONDUCTOR_HP,
  type PlayerStateView,
  type RankTierDefinition,
} from '@kod-raido/shared';
import { Icon, type IconName } from '@kod-raido/ui';
import { EnergyPips } from './EnergyPips';
import { FloatingFeedback } from './FloatingFeedback';
import type { FeedbackItem } from '@/lib/use-combat-feedback';

/** Same hexagon clip-path as CardView's cost/ATK/HP badges - one "gem/medallion" language shared
 * across cards and HUD instead of a mix of circles and pills. */
const HEX_CLIP = 'polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)';

export interface ConductorPanelProps {
  player: PlayerStateView;
  name: string;
  /** Original SVG glyph standing in for a portrait/emblem placeholder (section 20) - 'player' for
   * a human (you or a PvP opponent), 'bot' for the PvE bot. No emoji. */
  icon: IconName;
  align: 'left' | 'right';
  targetable: boolean;
  onTap: () => void;
  feedback: FeedbackItem[];
  rank?: RankTierDefinition;
  /** data-tutorial-target value for the tutorial overlay to spotlight, if any. */
  tutorialTarget?: string;
}

export function ConductorPanel({
  player,
  name,
  icon,
  align,
  targetable,
  onTap,
  feedback,
  rank,
  tutorialTarget,
}: ConductorPanelProps) {
  const hpPercent = Math.max(0, Math.min(100, (player.conductorHp / STARTING_CONDUCTOR_HP) * 100));
  const low = hpPercent <= 30;

  const [impactKey, setImpactKey] = useState(0);
  const damaged = feedback.some((f) => f.kind === 'damage');
  const healed = feedback.some((f) => f.kind === 'heal');
  useEffect(() => {
    if (damaged || healed) setImpactKey((k) => k + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedback.length]);

  const reversed = align === 'right';

  return (
    <button
      type="button"
      onClick={onTap}
      disabled={!targetable}
      data-tutorial-target={tutorialTarget}
      aria-label={`${name}: ${player.conductorHp} здоровья, ${player.energy} из ${player.maxEnergy} энергии${targetable ? ' — доступная цель' : ''}`}
      className={clsx(
        // Battlefield 3.1: an arena-mounted metal plate (antique-gold hairline border + inset top
        // highlight reading as embossed metal), corner brackets instead of dots, and an ambient
        // glow bleeding toward the arena edge it's mounted on - same functional content/shape,
        // restyled material only.
        'group relative flex items-center gap-2.5 rounded-panel border bg-gradient-to-b from-raido-steel to-raido-black px-2.5 py-2 text-left shadow-[0_10px_18px_-10px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.04)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-raido-red',
        reversed && 'flex-row-reverse text-right',
        targetable ? 'border-emerald-400/70 ring-1 ring-emerald-400/50' : 'border-raido-gold/25',
        low && 'border-raido-red/50',
      )}
    >
      {/* Ambient edge glow - reads as "this plate is mounted into the arena ring", bleeding off
          the panel's outer edge rather than sitting as a flat rectangle on the background. */}
      <span
        aria-hidden
        className={clsx(
          'pointer-events-none absolute inset-y-2 w-10 rounded-full bg-raido-gold/10 blur-lg',
          reversed ? '-right-3' : '-left-3',
        )}
      />
      {/* Corner brackets - the same L-shaped accent language as CardView's Legendary/Raido
          corners, mirrored for the right-aligned panel. */}
      <span
        aria-hidden
        className={clsx(
          'pointer-events-none absolute top-1 h-2 w-2 border-raido-gold/35',
          reversed ? 'right-1 border-r border-t' : 'left-1 border-l border-t',
        )}
      />
      <span
        aria-hidden
        className={clsx(
          'pointer-events-none absolute bottom-1 h-2 w-2 border-raido-gold/35',
          reversed ? 'left-1 border-b border-l' : 'right-1 border-b border-r',
        )}
      />
      {damaged && impactKey > 0 ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 rounded-panel ring-2 ring-raido-red/70 animate-ring-expand"
        />
      ) : null}
      <span
        key={impactKey}
        aria-hidden
        style={{ clipPath: HEX_CLIP }}
        className={clsx(
          'relative z-10 flex h-11 w-11 flex-shrink-0 items-center justify-center bg-raido-black text-raido-white ring-1 ring-inset',
          low ? 'ring-raido-red/50' : 'ring-raido-gold/30',
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

      <span className="relative z-10 flex min-w-0 flex-1 flex-col gap-1">
        <span className="flex items-baseline gap-1.5">
          <span className="truncate text-sm font-semibold text-raido-white">{name}</span>
        </span>
        <span className={clsx('flex items-center gap-1.5', reversed && 'flex-row-reverse')}>
          <span className="h-1.5 w-16 overflow-hidden rounded-full bg-black/50">
            <span
              className={clsx(
                'block h-full rounded-full transition-[width] duration-500 ease-out',
                low ? 'bg-raido-redGlow' : 'bg-emerald-400',
              )}
              style={{ width: `${hpPercent}%` }}
            />
          </span>
          <span className="flex items-center gap-0.5 text-[11px] font-bold tabular-nums text-raido-white">
            <Icon name="heart" size={11} /> {player.conductorHp}
          </span>
        </span>
        <EnergyPips
          energy={player.energy}
          maxEnergy={player.maxEnergy}
          className={reversed ? 'flex-row-reverse' : ''}
        />
      </span>

      {/* A large HP numeral medallion at the panel's outer end - the "big readable number" cue
          from the reference concept, layered alongside (not replacing) the existing bar/pips. */}
      <span
        aria-hidden
        style={{ clipPath: HEX_CLIP }}
        className={clsx(
          'relative z-10 hidden h-12 w-12 flex-shrink-0 items-center justify-center bg-black/60 text-lg font-black tabular-nums ring-1 ring-inset sm:flex',
          low ? 'text-raido-redGlow ring-raido-red/40' : 'text-raido-white ring-raido-gold/25',
        )}
      >
        {player.conductorHp}
      </span>

      <FloatingFeedback items={feedback} />
    </button>
  );
}
