'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import type { StatusType, UnitInstanceView } from '@kod-raido/shared';
import { Icon, type IconName } from '@kod-raido/ui';
import { FloatingFeedback } from './FloatingFeedback';
import type { FeedbackItem } from '@/lib/use-combat-feedback';

/** Original SVG icon + accessible Russian label per status - no emoji in the premium battlefield
 * UI (section 29). Labels match the shared KEYWORD_REGISTRY vocabulary used by the help sheet. */
const STATUS_ICON: Record<StatusType, IconName> = {
  SHIELD: 'shield',
  IMPULSE: 'impulse',
  HIDDEN: 'hidden',
  CURSE: 'curse',
  SILENCED: 'silenced',
};

const STATUS_LABEL: Record<StatusType, string> = {
  SHIELD: 'Щит',
  IMPULSE: 'Импульс',
  HIDDEN: 'Скрытый',
  CURSE: 'Проклятие',
  SILENCED: 'Заглушение',
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
    // Battlefield 3.3: an empty slot reads as a small ritual platform set into the arena floor -
    // a rim-lit raised rim (same embossed-metal language as BattlefieldArena's rings), a ring of
    // fine engraved tick marks, and a warm ambient base glow - rather than a plain sunken circle.
    return (
      <div aria-hidden="true" className="flex aspect-[3/4] w-full items-center justify-center">
        <div className="relative flex aspect-square w-[78%] items-center justify-center">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-[8%] bottom-[2%] h-[18%] rounded-full bg-raido-gold/[0.06] blur-md"
          />
          <div
            className="relative flex h-full w-full items-center justify-center rounded-full"
            style={{
              background:
                'radial-gradient(circle at 50% 40%, rgba(255,255,255,0.04), rgba(0,0,0,0.4) 78%)',
              boxShadow:
                'inset 0 2px 6px rgba(0,0,0,0.6), inset 0 -1px 2px rgba(255,255,255,0.04), 0 1px 0 rgba(255,255,255,0.03)',
            }}
          >
            <span className="absolute inset-0 rounded-full border border-raido-gold/[0.1]" />
            <span
              className="absolute inset-[12%] rounded-full opacity-[0.08]"
              style={{
                backgroundImage:
                  'repeating-conic-gradient(from 0deg, rgba(217,180,106,0.9) 0deg 1.2deg, transparent 1.2deg 30deg)',
              }}
            />
            <span className="absolute inset-[22%] rounded-full border border-white/[0.05]" />
            <span className="text-lg text-raido-gold/[0.14]">ᚱ</span>
          </div>
        </div>
      </div>
    );
  }

  const canInteract = Boolean(interactive || targetable);
  const isReady = readyToAttack && !selected;

  return (
    <div className="relative aspect-[3/4] w-full">
      {/* Battlefield Visual Target 3.0: a socket glow sunk into the arena beneath the card, so an
          occupied slot reads as "a physical card resting in an engraved plate" - quiet by
          default, brighter for a ready attacker, matching the emerald "invitation" language
          already used for targetable rings below. */}
      <span
        aria-hidden
        className={clsx(
          'pointer-events-none absolute left-1/2 top-[86%] h-[22%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-md transition-opacity duration-300',
          isReady ? 'bg-emerald-400/25' : 'bg-black/50',
        )}
      />
      <button
        type="button"
        disabled={!canInteract}
        onClick={() => onSelect?.(unit)}
        data-tutorial-target={readyToAttack ? 'own-board' : undefined}
        aria-label={`${unit.card.name}: атака ${unit.attack}, здоровье ${unit.health}${targetable ? ' — доступная цель' : ''}${selected ? ' — выбран' : ''}`}
        aria-pressed={selected}
        className={clsx(
          'relative flex h-full w-full flex-col overflow-hidden rounded-lg border bg-raido-graphite text-left shadow-[0_10px_16px_-8px_rgba(0,0,0,0.85)] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-raido-red',
          canInteract && 'active:scale-95',
          // Selected = the declared attacker: lifted, leaned slightly forward, red-ringed - the
          // existing "-translate-y-1" plus a small scale reads as "stepping out of its socket"
          // without a new attacker-tracking event/prop.
          selected
            ? '-translate-y-1.5 scale-[1.03] border-raido-red ring-2 ring-raido-red'
            : 'border-white/10',
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
            <div className="absolute left-0.5 top-0.5 flex gap-0.5">
              {unit.statuses.map((s) => (
                <span
                  key={s}
                  title={STATUS_LABEL[s]}
                  role="img"
                  aria-label={STATUS_LABEL[s]}
                  className="flex h-4 w-4 items-center justify-center rounded-full bg-black/60 text-raido-white"
                >
                  <Icon name={STATUS_ICON[s]} size={10} />
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
    </div>
  );
}
