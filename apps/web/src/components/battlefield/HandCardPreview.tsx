'use client';

import { useEffect } from 'react';
import clsx from 'clsx';
import type { Card } from '@kod-raido/shared';
import { Icon, RARITY_FRAME_CLASS, RARITY_LABEL, ResonanceBadge } from '@kod-raido/ui';
import { KeywordText } from '@/components/KeywordText';

const TYPE_LABEL: Record<Card['type'], string> = {
  CHARACTER: 'Персонаж',
  TRACK: 'Трек',
  RUNE: 'Руна',
  EVENT: 'Событие',
  EDIT: 'Эдит',
};

export interface HandCardPreviewProps {
  card: Card | null;
  onClose: () => void;
  /** Arms the previewed card via the existing PLAY_CARD selection flow (same as press-hold +
   * drag + release from the hand) and closes the preview - the keyboard/no-drag fallback path,
   * since a tap on the hand card itself now only opens/closes this preview. Undefined when there
   * is nothing to play (`card` is null). */
  onPlay?: () => void;
}

export function HandCardPreview({ card, onClose, onPlay }: HandCardPreviewProps) {
  useEffect(() => {
    if (!card) return undefined;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [card, onClose]);

  if (!card) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm md:items-center"
      onClick={onClose}
      role="presentation"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={card.name}
        className="max-h-[80dvh] w-full max-w-sm overflow-y-auto rounded-t-3xl border border-white/10 bg-raido-graphite p-5 md:rounded-3xl"
      >
        <div className="mb-4 flex items-start gap-4">
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть просмотр карты"
            className="flex-shrink-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-raido-red"
          >
            <img
              src={card.artworkUrl}
              alt=""
              className={clsx('h-36 w-28 rounded-xl border object-cover', RARITY_FRAME_CLASS[card.rarity])}
            />
          </button>
          <div className="flex flex-1 flex-col gap-1.5">
            <h2 className="font-display text-lg font-bold">{card.name}</h2>
            <p className="text-xs uppercase tracking-wide text-raido-mist">
              {TYPE_LABEL[card.type]} · {RARITY_LABEL[card.rarity]} · Стоимость {card.cost}
            </p>
            {card.type === 'CHARACTER' ? (
              <p className="flex items-center gap-2 text-sm font-semibold">
                <span className="flex items-center gap-0.5">
                  <Icon name="sword" size={13} /> {card.attack}
                </span>
                <span className="flex items-center gap-0.5 text-raido-redGlow">
                  <Icon name="heart" size={13} /> {card.health}
                </span>
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
            <KeywordText text={card.abilityText} />
          </p>
        ) : null}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full bg-raido-steel py-2.5 text-sm text-raido-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-raido-red"
          >
            Закрыть
          </button>
          {onPlay ? (
            <button
              type="button"
              onClick={onPlay}
              className="flex-1 rounded-full bg-raido-red py-2.5 text-sm font-semibold text-raido-white shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-raido-red"
            >
              Сыграть
            </button>
          ) : null}
        </div>
        <p className="mt-2 text-center text-[11px] text-raido-mist">
          Зажмите карту в руке и перетащите на поле, чтобы сыграть напрямую
        </p>
      </div>
    </div>
  );
}
