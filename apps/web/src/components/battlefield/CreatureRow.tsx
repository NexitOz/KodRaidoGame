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
  /** Battlefield 3.1: which way the row bows along the arena's circular rings - 'down' (default,
   * player's row) sinks the outer slots toward the arena floor with the center slightly raised;
   * 'up' (opponent's row) mirrors it so the whole row reads as sitting on the ring's far curve. */
  curve?: 'up' | 'down';
}

const ARC_STEP_PX = 5;

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
  curve = 'down',
}: CreatureRowProps) {
  const slots = Array.from({ length: MAX_BOARD_UNITS }, (_, i) => units[i] ?? null);
  const center = (slots.length - 1) / 2;
  const direction = curve === 'up' ? -1 : 1;

  return (
    <div className="relative grid grid-cols-5 gap-1.5">
      {deathToasts.length > 0 ? (
        <div
          className="pointer-events-none absolute -top-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full bg-black/80 px-2 py-1"
          role="status"
        >
          {deathToasts.map((d) => (
            <span
              key={d.id}
              className="animate-float-up text-raido-mist"
              role="img"
              aria-label="Существо погибло"
            >
              <Icon name="skull" size={13} />
            </span>
          ))}
        </div>
      ) : null}
      {slots.map((unit, i) => {
        const offset = i - center;
        return (
          <div
            key={unit?.instanceId ?? `empty-${i}`}
            style={{ transform: `translateY(${direction * Math.abs(offset) * ARC_STEP_PX}px)` }}
          >
            <CreatureSlot
              unit={unit}
              interactive={unit ? interactiveIds?.has(unit.instanceId) : false}
              selected={unit ? selectedInstanceId === unit.instanceId : false}
              readyToAttack={unit ? readyAttackerIds?.has(unit.instanceId) : false}
              targetable={unit ? targetableIds?.has(unit.instanceId) : false}
              dimmed={hasActiveSelection}
              onSelect={onSelect}
              feedback={unit ? (feedbackByTarget.get(`unit:${unit.instanceId}`) ?? []) : []}
            />
          </div>
        );
      })}
    </div>
  );
}
