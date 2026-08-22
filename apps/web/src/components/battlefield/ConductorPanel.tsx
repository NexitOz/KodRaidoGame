'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { STARTING_CONDUCTOR_HP, type PlayerStateView, type RankTierDefinition } from '@kod-raido/shared';
import type { IconName } from '@kod-raido/ui';
import { EnergyPips } from './EnergyPips';
import { FloatingFeedback } from './FloatingFeedback';
import { HeroFrame } from './arena/HeroFrame';
import type { FeedbackItem } from '@/lib/use-combat-feedback';

export interface ConductorPanelProps {
  player: PlayerStateView;
  name: string;
  icon: IconName;
  align: 'left' | 'right';
  targetable: boolean;
  onTap: () => void;
  feedback: FeedbackItem[];
  rank?: RankTierDefinition;
  tutorialTarget?: string;
  active?: boolean;
  dropZone?: string;
  side: 'opponent' | 'player';
}

export function ConductorPanel({
  player,
  name,
  icon,
  targetable,
  onTap,
  feedback,
  rank,
  tutorialTarget,
  active = false,
  dropZone,
  side,
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

  return (
    <button
      type="button"
      onClick={onTap}
      disabled={!targetable}
      data-tutorial-target={tutorialTarget}
      data-drop-zone={dropZone}
      aria-label={`${name}: ${player.conductorHp} здоровья, ${player.energy} из ${player.maxEnergy} энергии${targetable ? ' — доступная цель' : ''}`}
      className={clsx(
        'group relative flex flex-col items-center gap-0 rounded-2xl px-0 pb-0 pt-0 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-raido-red lg:gap-1.5 lg:px-2 lg:pb-2 lg:pt-3',
        targetable && 'lg:ring-2 lg:ring-emerald-400/60 lg:ring-offset-2 lg:ring-offset-raido-black',
        targetable ? 'pointer-events-auto' : 'pointer-events-none',
      )}
    >
      {damaged && impactKey > 0 ? (
        <span aria-hidden className="pointer-events-none absolute inset-0 z-0 rounded-2xl ring-2 ring-raido-red/70 animate-ring-expand" />
      ) : null}

      <HeroFrame
        icon={icon}
        low={low}
        targetable={targetable}
        rank={rank ? { tier: rank.tier, label: rank.label } : undefined}
        impactKey={impactKey}
        damaged={damaged}
        healed={healed}
        active={active}
        hp={player.conductorHp}
        side={side}
      />

      <span className="relative z-10 -mt-1 max-w-full truncate text-[8px] font-bold uppercase tracking-wide text-raido-white [text-shadow:0_1px_3px_rgba(0,0,0,1)] lg:mt-2 lg:text-xs lg:[text-shadow:none]">
        {name}
      </span>
      <EnergyPips energy={player.energy} maxEnergy={player.maxEnergy} className="relative z-10 origin-top scale-[0.72] justify-center lg:scale-100" />

      <FloatingFeedback items={feedback} />
    </button>
  );
}
