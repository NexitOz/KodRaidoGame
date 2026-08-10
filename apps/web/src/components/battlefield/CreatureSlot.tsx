'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import type { UnitInstanceView } from '@kod-raido/shared';
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
        <span className="text-lg text-white/10">◈</span>
      </div>
    );
  }

  const canInteract = Boolean(interactive || targetable);

  return (
    <button
      type="button"
      disabled={!canInteract}
      onClick={() => onSelect?.(unit)}
      aria-label={`${unit.card.name}: атака ${unit.attack}, здоровье ${unit.health}${targetable ? ' — доступная цель' : ''}${selected ? ' — выбран' : ''}`}
      aria-pressed={selected}
      className={clsx(
        'relative flex aspect-[3/4] w-full flex-col overflow-hidden rounded-lg border bg-raido-graphite text-left transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-raido-red',
        canInteract && 'active:scale-95',
        selected
          ? 'border-raido-red ring-2 ring-raido-red'
          : targetable
            ? 'animate-ready-glow border-emerald-400/70'
            : readyToAttack
              ? 'animate-ready-glow border-emerald-400/50'
              : 'border-white/10',
        dimmed && !targetable && !selected && 'opacity-40',
      )}
    >
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
      </div>
      <div
        key={impactKey}
        className={clsx(
          'flex items-center justify-between bg-black/70 px-1 py-0.5 text-[10px] font-bold text-raido-white',
          impactKey > 0 && (damaged ? 'animate-shake-hit' : healed ? 'animate-flash-hit' : ''),
        )}
      >
        <span>⚔ {unit.attack}</span>
        <span>♥ {unit.health}</span>
      </div>
    </button>
  );
}
