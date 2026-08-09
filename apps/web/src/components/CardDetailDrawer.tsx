'use client';

import { useEffect } from 'react';
import type { Card } from '@kod-raido/shared';
import { RARITY_LABEL, ResonanceBadge } from '@kod-raido/ui';

const TYPE_LABEL: Record<Card['type'], string> = {
  CHARACTER: 'Персонаж',
  TRACK: 'Трек',
  RUNE: 'Руна',
  EVENT: 'Событие',
  EDIT: 'Эдит',
};

export function CardDetailDrawer({ card, onClose }: { card: Card | null; onClose: () => void }) {
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
          Resonance-буст фиксируется в начале матча. Реальные метрики (прослушивания, лайки,
          репосты) появятся здесь после запуска импорта в Phase 5 — сейчас показан базовый Tier{' '}
          {card.resonanceTier}.
        </div>

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
