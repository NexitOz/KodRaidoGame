'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import type { StatusType, UnitInstanceView } from '@kod-raido/shared';
import { Icon, type IconName } from '@kod-raido/ui';
import { FloatingFeedback } from './FloatingFeedback';
import { FactionAmbience } from './arena/FactionAmbience';
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
    return (
      <div
        aria-hidden="true"
        className="relative flex aspect-[3/4] w-full flex-col items-center justify-center overflow-hidden rounded-lg border border-raido-gold/10 bg-gradient-to-b from-black/60 to-raido-black [box-shadow:inset_0_4px_14px_rgba(0,0,0,0.75),inset_0_-2px_8px_rgba(0,0,0,0.5)]"
      >
        {/* Recessed stone plate look - a physical socket carved into the arena, not a dashed
            placeholder box. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-1.5 rounded-md border border-raido-gold/10"
          style={{ backgroundImage: 'radial-gradient(circle at 50% 42%, rgba(217,180,106,0.05), transparent 65%)' }}
        />
        {/* Engraved rune-circle sigil - idle, faction-neutral, low glow. */}
        <svg aria-hidden viewBox="0 0 100 100" className="pointer-events-none absolute h-3/5 w-3/5 text-raido-gold/15">
          <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="1" fill="none" />
          <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.5" fill="none" strokeDasharray="2 4" />
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = (i / 6) * 2 * Math.PI;
            const x1 = 50 + Math.cos(angle) * 30;
            const y1 = 50 + Math.sin(angle) * 30;
            const x2 = 50 + Math.cos(angle) * 42;
            const y2 = 50 + Math.sin(angle) * 42;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="0.5" />;
          })}
        </svg>
        <span className="relative text-2xl text-raido-gold/20" style={{ fontFamily: 'serif' }}>
          ᚱ
        </span>
        {/* Ornamental corners, matching the arena's brass filigree language. */}
        <span aria-hidden className="pointer-events-none absolute left-1 top-1 h-2.5 w-2.5 border-l border-t border-raido-gold/25" />
        <span aria-hidden className="pointer-events-none absolute right-1 top-1 h-2.5 w-2.5 border-r border-t border-raido-gold/25" />
        <span aria-hidden className="pointer-events-none absolute bottom-1 left-1 h-2.5 w-2.5 border-b border-l border-raido-gold/25" />
        <span aria-hidden className="pointer-events-none absolute bottom-1 right-1 h-2.5 w-2.5 border-b border-r border-raido-gold/25" />
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
        'relative flex aspect-[3/4] w-full flex-col overflow-hidden rounded-lg border bg-raido-graphite text-left shadow-[0_6px_10px_-6px_rgba(0,0,0,0.7)] [box-shadow:inset_0_1px_6px_rgba(0,0,0,0.5),0_6px_10px_-6px_rgba(0,0,0,0.7)] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-raido-red',
        canInteract && 'active:scale-95',
        selected ? '-translate-y-1 border-raido-red ring-2 ring-raido-red' : 'border-raido-gold/25',
        dimmed && !targetable && !selected && 'opacity-40',
        // Plays once on mount only (stable instanceId key => no remount on later re-renders),
        // giving a freshly-summoned CHARACTER a short "landed on the battlefield" impact pulse.
        unit.summonedThisTurn && 'animate-card-in',
      )}
    >
      {/* Metallic corner trim - a quiet reminder the slot is a carved arena fixture, not a plain
          card frame. */}
      <span aria-hidden className="pointer-events-none absolute left-0.5 top-0.5 z-10 h-3 w-3 border-l-2 border-t-2 border-raido-gold/35" />
      <span aria-hidden className="pointer-events-none absolute right-0.5 top-0.5 z-10 h-3 w-3 border-r-2 border-t-2 border-raido-gold/35" />
      <span aria-hidden className="pointer-events-none absolute bottom-0.5 left-0.5 z-10 h-3 w-3 border-b-2 border-l-2 border-raido-gold/35" />
      <span aria-hidden className="pointer-events-none absolute bottom-0.5 right-0.5 z-10 h-3 w-3 border-b-2 border-r-2 border-raido-gold/35" />

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
        <FactionAmbience faction={unit.card.faction} />
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
  );
}
