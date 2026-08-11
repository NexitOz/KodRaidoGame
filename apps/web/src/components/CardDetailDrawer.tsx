'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { explainCardResonance, type Card } from '@kod-raido/shared';
import {
  Icon,
  RARITY_FRAME_CLASS,
  RARITY_LABEL,
  ResonanceBadge,
  ResonanceRing,
  RuneDivider,
  factionAccent,
} from '@kod-raido/ui';
import { api } from '@/lib/api';
import { factionLabel } from '@/lib/factions';
import { playSfx } from '@/lib/sfx';
import { KeywordText } from './KeywordText';

const TYPE_LABEL: Record<Card['type'], string> = {
  CHARACTER: 'Персонаж',
  TRACK: 'Трек',
  RUNE: 'Руна',
  EVENT: 'Событие',
  EDIT: 'Эдит',
};

/**
 * Renders explainCardResonance()'s per-Tier breakdown (T0-T2 base / T3 change / T5 change, or
 * whichever tiers the card's own DSL actually declares) - generated entirely from the DSL, never
 * from a per-cardId description.
 */
function ResonanceExplanation({ card }: { card: Card }) {
  const explanation = explainCardResonance(card);

  return (
    <div className="mb-4 rounded-xl border border-dashed border-raido-mist/30 p-3 text-xs text-raido-mist">
      {explanation.isReactive ? (
        <ul className="flex flex-col gap-1">
          {explanation.tiers.map((tier) => (
            <li key={tier.tier}>
              <span className="font-semibold text-raido-gold">При Резонансе {tier.tier}+:</span>{' '}
              {tier.descriptions.join(', ')}.
            </li>
          ))}
        </ul>
      ) : (
        <p>Резонанс этой карты влияет только на визуальный эффект (пульс) на поле боя — способность не меняется.</p>
      )}
      <p className="mt-1">Резонанс фиксируется в начале матча (Tier {card.resonanceTier} сейчас).</p>
    </div>
  );
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

  useEffect(() => {
    if (card?.rarity === 'RAIDO') playSfx('raido-reveal');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card?.id]);

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
        className={clsx(
          'max-h-[88dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl border bg-gradient-to-b from-raido-graphite to-raido-black p-5 shadow-panel md:rounded-3xl',
          card.rarity === 'RAIDO' ? 'border-raido-red/50 shadow-raido' : 'border-white/10',
        )}
      >
        <div className="relative mb-4">
          {/* Cinematic mode (Art Pack 01): a large hero-style artwork banner reads as a
              collectible illustration rather than a thumbnail. The faction-tinted glow sits on
              its own static (non-animated) layer behind the frame, so it needs no Low Data
              Mode/reduced-motion gating - only ResonanceRing's own ring-expand animation does,
              and that's an existing shared component already covered by the global gating. */}
          <div
            aria-hidden
            className={clsx(
              'pointer-events-none absolute inset-x-4 top-2 h-40 rounded-full blur-3xl',
              factionAccent(card.faction).glowClass,
            )}
          />
          <div className="relative flex justify-center">
            <div className="pointer-events-none absolute -left-4 -top-4 z-10 opacity-60">
              <ResonanceRing tier={card.resonanceTier} size={110} />
            </div>
            <div
              className={clsx(
                'relative aspect-[3/4] w-full max-w-[240px] overflow-hidden rounded-2xl border transition-transform duration-300 hover:scale-[1.015]',
                RARITY_FRAME_CLASS[card.rarity],
              )}
            >
              <img src={card.artworkUrl} alt={card.name} className="h-full w-full object-cover" />
            </div>
          </div>
          <div className="relative mt-3 flex flex-col items-center gap-1.5 text-center">
            <h2 className="font-display text-xl font-bold">{card.name}</h2>
            <p className="text-xs uppercase tracking-wide text-raido-mist">
              {TYPE_LABEL[card.type]} · {RARITY_LABEL[card.rarity]} · Стоимость {card.cost}
            </p>
            <p className="text-xs text-raido-mist">
              {factionLabel(card.faction)}
              {card.subFactions.length ? ` · ${card.subFactions.join(', ')}` : ''}
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

        <RuneDivider className="mb-4" />

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

        <ResonanceExplanation card={card} />

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
            Слушать (скоро)
          </button>
          <button
            type="button"
            disabled
            className="flex-1 rounded-full border border-white/10 px-4 py-2 text-sm text-raido-mist disabled:opacity-50"
          >
            Смотреть эдиты (скоро)
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
