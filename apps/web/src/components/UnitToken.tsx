'use client';

import type { UnitInstanceView } from '@kod-raido/shared';
import clsx from 'clsx';

const STATUS_ICON: Record<string, string> = {
  SHIELD: '🛡',
  IMPULSE: '⚡',
  HIDDEN: '👁',
  CURSE: '☠',
  SILENCED: '🔇',
};

export interface UnitTokenProps {
  unit: UnitInstanceView;
  selectable?: boolean;
  selected?: boolean;
  targetable?: boolean;
  onSelect?: (unit: UnitInstanceView) => void;
}

export function UnitToken({ unit, selectable, selected, targetable, onSelect }: UnitTokenProps) {
  const interactive = selectable || targetable;

  return (
    <button
      type="button"
      disabled={!interactive}
      onClick={() => onSelect?.(unit)}
      className={clsx(
        'relative flex w-16 flex-col overflow-hidden rounded-lg border bg-raido-graphite text-left transition-transform',
        interactive && 'active:scale-95',
        selected
          ? 'border-raido-red ring-2 ring-raido-red'
          : targetable
            ? 'border-emerald-400/70 ring-1 ring-emerald-400/40'
            : 'border-white/10',
      )}
    >
      <div className="relative aspect-square w-full bg-raido-black">
        <img
          src={unit.card.artworkUrl}
          alt={unit.card.name}
          className="h-full w-full object-cover opacity-90"
          loading="lazy"
        />
        {unit.statuses.length > 0 ? (
          <div className="absolute left-0.5 top-0.5 flex gap-0.5 text-[10px]">
            {unit.statuses.map((s) => (
              <span key={s} title={s}>
                {STATUS_ICON[s] ?? '•'}
              </span>
            ))}
          </div>
        ) : null}
      </div>
      <div className="flex items-center justify-between bg-black/70 px-1 py-0.5 text-[10px] font-bold text-raido-white">
        <span>⚔ {unit.attack}</span>
        <span>♥ {unit.health}</span>
      </div>
    </button>
  );
}
