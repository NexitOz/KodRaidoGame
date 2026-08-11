'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import type { UnitInstanceView } from '@kod-raido/shared';
import { Icon } from '@kod-raido/ui';
import { FloatingFeedback } from './FloatingFeedback';
import type { FeedbackItem } from '@/lib/use-combat-feedback';

const STATUS_ICON: Record<string, string> = {
  SHIELD: '🛡',
  IMPULSE: '⚡',
  HIDDEN: '👁',
  CURSE: '☠',
  SILENCED: '🔇',
};

export interface CreatureSlotProps {
  unit: UnitInstanceView | null;
  interactive?: boolean;
  selected?: boolean;
  readyToAttack?: boolean;
  targetable?: boolean;
  /** There's an active selection, but this unit isn't a legal target for it. */
  dimmed?: boolean;
  onSelect?: (unit: UnitInstanceView) => void;
  feedback?: FeedbackItem[];
}

export function CreatureSlot({
  unit,
  interactive,
  selected,
  readyToAttack,
  targetable,
  dimmed,
  onSelect,
  feedback = [],
}: CreatureSlotProps) {
  const [impactKey, setImpactKey] = useState(0);
  const damaged = feedback.some((f) => f.kind === 'damage');
  const healed = feedback.some((f) => f.kind === 'heal');
  useEffect(() => {
    if (damaged || healed) setImpactKey((k) => k + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedback.length]);

  if (!unit) {
    return (
      <div
        aria-hidden="true"
        className="flex aspect-[3/4] w-full flex-col items-center justify-center rounded-lg border border-dashed border-white/10 bg-white/[0.02]"
      >
        <span className="text-lg text-white/[0.08]">ᚱ</span>
      </div>
    );
  }

  const canInteract = Boolean(interactive || targetable);
  const isReady = readyToAttack && !selected;

  return (
    <button
      type="button"
      disabled={!canInteract}
      onClick={() => onSelect?.(unit)}
      data-tutorial-target={readyToAttack ? 'own-board' : undefined}
      aria-label={`${unit.card.name}: атака ${unit.attack}, здоровье ${unit.health}${targetable ? ' — доступная цель' : ''}${selected ? ' — выбран' : ''}`}
      aria-pressed={selected}
      className={clsx(
        'relative flex aspect-[3/4] w-full flex-col overflow-hidden rounded-lg border bg-raido-graphite text-left shadow-[0_6px_10px_-6px_rgba(0,0,0,0.7)] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-raido-red',
        canInteract && 'active:scale-95',
        selected ? '-translate-y-1 border-raido-red ring-2 ring-raido-red' : 'border-white/10',
        dimmed && !targetable && !selected && 'opacity-40',
        // Plays once on mount only (stable instanceId key => no remount on later re-renders),
        // giving a freshly-summoned CHARACTER a short "landed on the battlefield" impact pulse.
        unit.summonedThisTurn && 'animate-card-in',
      )}
    >
      {/* Targetable = an expanding ring pulse, not a bright warning color - legality reads as an
          invitation, not an error. */}
      {targetable ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 rounded-lg ring-2 ring-emerald-400/80 animate-ring-expand"
        />
      ) : null}
      <div className="relative flex-1 bg-raido-black">
        <img
          src={unit.card.artworkUrl}
          alt=""
          className="h-full w-full object-cover opacity-90"
          loading="lazy"
        />
        {unit.statuses.length > 0 ? (
          <div className="absolute left-0.5 top-0.5 flex gap-0.5 text-[10px]" aria-hidden="true">
            {unit.statuses.map((s) => (
              <span key={s} title={s}>
                {STATUS_ICON[s] ?? '•'}
              </span>
            ))}
          </div>
        ) : null}
        <FloatingFeedback items={feedback} />
        {/* Ready-to-attack: a soft glow at the slot's base only, not a flashing border. */}
        {isReady ? (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-2 bottom-1 h-1 rounded-full bg-emerald-400/70 animate-ready-glow"
          />
        ) : null}
      </div>
      <div
        key={impactKey}
        className={clsx(
          'flex items-center justify-between bg-black/70 px-1 py-0.5 text-[10px] font-bold text-raido-white',
          impactKey > 0 && (damaged ? 'animate-shake-hit' : healed ? 'animate-flash-hit' : ''),
        )}
      >
        <span className="flex items-center gap-0.5">
          <Icon name="sword" size={10} /> {unit.attack}
        </span>
        <span className="flex items-center gap-0.5 text-raido-redGlow">
          <Icon name="heart" size={10} /> {unit.health}
        </span>
      </div>
    </button>
  );
}
