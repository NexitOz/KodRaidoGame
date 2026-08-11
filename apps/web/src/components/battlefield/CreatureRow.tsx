'use client';

import { MAX_BOARD_UNITS, type UnitInstanceView } from '@kod-raido/shared';
import { Icon } from '@kod-raido/ui';
import { CreatureSlot } from './CreatureSlot';
import type { DeathToast, FeedbackItem } from '@/lib/use-combat-feedback';

export interface CreatureRowProps {
  units: UnitInstanceView[];
  selectedInstanceId?: string | null;
  readyAttackerIds?: Set<string>;
  targetableIds?: Set<string>;
  hasActiveSelection: boolean;
  interactiveIds?: Set<string>;
  onSelect?: (unit: UnitInstanceView) => void;
  feedbackByTarget: Map<string, FeedbackItem[]>;
  deathToasts: DeathToast[];
}

export function CreatureRow({
  units,
  selectedInstanceId,
  readyAttackerIds,
  targetableIds,
  hasActiveSelection,
  interactiveIds,
  onSelect,
  feedbackByTarget,
  deathToasts,
}: CreatureRowProps) {
  const slots = Array.from({ length: MAX_BOARD_UNITS }, (_, i) => units[i] ?? null);

  return (
    <div className="relative grid grid-cols-5 gap-1.5">
      {deathToasts.length > 0 ? (
        <div
          className="pointer-events-none absolute -top-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full bg-black/80 px-2 py-1"
          role="status"
        >
          {deathToasts.map((d) => (
            <span key={d.id} className="animate-float-up text-raido-mist" role="img" aria-label="Существо погибло">
              <Icon name="skull" size={13} />
            </span>
          ))}
        </div>
      ) : null}
      {slots.map((unit, i) => (
        <CreatureSlot
          key={unit?.instanceId ?? `empty-${i}`}
          unit={unit}
          interactive={unit ? interactiveIds?.has(unit.instanceId) : false}
          selected={unit ? selectedInstanceId === unit.instanceId : false}
          readyToAttack={unit ? readyAttackerIds?.has(unit.instanceId) : false}
          targetable={unit ? targetableIds?.has(unit.instanceId) : false}
          dimmed={hasActiveSelection}
          onSelect={onSelect}
          feedback={unit ? (feedbackByTarget.get(`unit:${unit.instanceId}`) ?? []) : []}
        />
      ))}
    </div>
  );
}
