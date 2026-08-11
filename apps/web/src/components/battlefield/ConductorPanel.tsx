'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { STARTING_CONDUCTOR_HP, type PlayerStateView, type RankTierDefinition } from '@kod-raido/shared';
import { Icon } from '@kod-raido/ui';
import { EnergyPips } from './EnergyPips';
import { FloatingFeedback } from './FloatingFeedback';
import type { FeedbackItem } from '@/lib/use-combat-feedback';

export interface ConductorPanelProps {
  player: PlayerStateView;
  name: string;
  icon: string;
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
        'group relative flex items-center gap-2.5 rounded-panel border bg-gradient-to-b from-raido-graphite to-raido-graphite/60 px-2.5 py-2 text-left shadow-panel transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-raido-red',
        reversed && 'flex-row-reverse text-right',
        targetable
          ? 'border-emerald-400/70 ring-1 ring-emerald-400/50'
          : 'border-white/10',
        low && 'border-raido-red/40',
      )}
    >
      {damaged && impactKey > 0 ? (
        <span aria-hidden className="pointer-events-none absolute inset-0 z-0 rounded-panel ring-2 ring-raido-red/70 animate-ring-expand" />
      ) : null}
      <span
        key={impactKey}
        className={clsx(
          'relative z-10 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-raido-black text-base font-bold ring-1',
          low ? 'ring-raido-red/50' : 'ring-white/10',
          impactKey > 0 && (damaged ? 'animate-shake-hit' : healed ? 'animate-flash-hit' : ''),
        )}
      >
        {icon}
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
        <EnergyPips energy={player.energy} maxEnergy={player.maxEnergy} className={reversed ? 'flex-row-reverse' : ''} />
      </span>

      <FloatingFeedback items={feedback} />
    </button>
  );
}
