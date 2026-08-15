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
  /** Original SVG glyph standing in for a portrait/emblem placeholder (section 20) - 'player' for
   * a human (you or a PvP opponent), 'bot' for the PvE bot. No emoji. */
  icon: IconName;
  /** Kept for API compatibility with existing callers - the vertical hero-medallion layout reads
   * the same centered either way, so this no longer changes text alignment/row direction. */
  align: 'left' | 'right';
  targetable: boolean;
  onTap: () => void;
  feedback: FeedbackItem[];
  rank?: RankTierDefinition;
  /** data-tutorial-target value for the tutorial overlay to spotlight, if any. */
  tutorialTarget?: string;
  /** Whether it is currently this Conductor's turn - a quiet hero-frame lighting cue only. */
  active?: boolean;
  /** `data-drop-zone` value for drag-to-play (e.g. "own-conductor"/"enemy-conductor") - omit to
   * leave this panel out of the drop-zone map. */
  dropZone?: string;
  /** Permanent side identity for the hero medallion's frame color (crimson opponent / blue-violet
   * player) - independent of whose turn it is. */
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
        'group relative flex flex-col items-center gap-1.5 rounded-2xl px-2 pb-2 pt-3 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-raido-red',
        targetable && 'ring-2 ring-emerald-400/60 ring-offset-2 ring-offset-raido-black',
        // `disabled` already makes this a no-op when not targetable, but the *wrapper*
        // (`.plyCommanderSlot` in MatchBoard.module.css) is set `pointer-events:none` so it never
        // steals hover/click from whatever's rendered underneath at the same screen point (the
        // desktop hand dock's resting cards can land directly behind it for narrow hands) -
        // `pointer-events-auto` here opts this button itself back in, but only while it's actually
        // a valid target, matching `disabled`'s own condition.
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

      <span className="relative z-10 mt-2 truncate text-xs font-bold uppercase tracking-wide text-raido-white">
        {name}
      </span>
      <EnergyPips energy={player.energy} maxEnergy={player.maxEnergy} className="relative z-10 justify-center" />

      <FloatingFeedback items={feedback} />
    </button>
  );
}
