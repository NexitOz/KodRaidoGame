'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Card } from '@kod-raido/shared';
import { RARITY_LABEL, ResonanceBadge } from '@kod-raido/ui';
import { api } from '@/lib/api';
import { factionLabel } from '@/lib/factions';

const TYPE_LABEL: Record<Card['type'], string> = {
  CHARACTER: 'Персонаж',
  TRACK: 'Трек',
  RUNE: 'Руна',
  EVENT: 'Событие',
  EDIT: 'Эдит',
};

/**
 * Derives a human-readable Resonance behavior summary purely from the card's own DSL
 * conditions - no card-specific branching, works for any card in any future pack.
 */
function describeResonanceBehavior(card: Card): string {
  const tiers = new Set<number>();
  for (const def of card.effects) {
    for (const condition of def.conditions ?? []) {
      if (condition.type === 'RESONANCE_TIER_AT_LEAST' && typeof condition.value === 'number') {
        tiers.add(condition.value);
      }
    }
  }
  if (tiers.size === 0) {
    return 'Резонанс этой карты влияет только на визуальный эффект (пульс) на поле боя - способность не меняется.';
  }
  const sorted = Array.from(tiers).sort((a, b) => a - b);
  return `Способность этой карты усиливается при Резонансе ${sorted.map((t) => `${t}+`).join(', ')}.`;
}

export function CardDetailDrawer({ card, onClose }: { card: Card | null; onClose: () => void }) {
  const { data: tracks } = useQuery({ queryKey: ['tracks'], queryFn: api.getTracks });
  const linkedTrack = tracks?.find((t) => card?.linkedTrackIds.includes(t.id));

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!card) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-black/70 backdrop-blur-sm md:items-center"
      onClick={onClose}
      role="presentation"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={card.name}
        className="max-h-[88dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-white/10 bg-raido-graphite p-5 md:rounded-3xl"
      >
        <div className="mb-4 flex items-start gap-4">
          <img
            src={card.artworkUrl}
            alt={card.name}
            className="h-40 w-32 flex-shrink-0 rounded-xl object-cover"
          />
          <div className="flex flex-1 flex-col gap-1.5">
            <h2 className="font-display text-xl font-bold">{card.name}</h2>
            <p className="text-xs uppercase tracking-wide text-raido-mist">
              {TYPE_LABEL[card.type]} · {RARITY_LABEL[card.rarity]} · Стоимость {card.cost}
            </p>
            <p className="text-xs text-raido-mist">
              {factionLabel(card.faction)}
              {card.subFactions.length ? ` · ${card.subFactions.join(', ')}` : ''}
            </p>
            {card.type === 'CHARACTER' ? (
              <p className="text-sm font-semibold">
                ⚔ {card.attack} ♥ {card.health}
              </p>
            ) : null}
            <ResonanceBadge tier={card.resonanceTier} />
          </div>
        </div>

        {card.tags.length ? (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {card.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-raido-mist"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        {card.abilityText ? (
          <p className="mb-4 rounded-xl border border-white/5 bg-black/30 p-3 text-sm leading-relaxed text-raido-white/90">
            {card.abilityText}
          </p>
        ) : null}

        <div className="mb-4 rounded-xl border border-dashed border-raido-mist/30 p-3 text-xs text-raido-mist">
          {describeResonanceBehavior(card)} Резонанс фиксируется в начале матча (Tier{' '}
          {card.resonanceTier} сейчас).
        </div>

        {linkedTrack ? (
          <div className="mb-4 rounded-xl border border-white/5 bg-black/30 p-3 text-xs text-raido-mist">
            Связанный трек: <span className="text-raido-white">{linkedTrack.title}</span>
          </div>
        ) : null}

        <div className="flex gap-2">
          <button
            type="button"
            disabled
            className="flex-1 rounded-full border border-white/10 px-4 py-2 text-sm text-raido-mist disabled:opacity-50"
          >
            ▶ Слушать (скоро)
          </button>
          <button
            type="button"
            disabled
            className="flex-1 rounded-full border border-white/10 px-4 py-2 text-sm text-raido-mist disabled:opacity-50"
          >
            🎬 Смотреть эдиты (скоро)
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full rounded-full bg-raido-steel py-2 text-sm text-raido-white"
        >
          Закрыть
        </button>
      </div>
    </div>
  );
}
