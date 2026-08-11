'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Card } from '@kod-raido/shared';
import { CardView, RARITY_LABEL, RuneDivider } from '@kod-raido/ui';
import { api } from '@/lib/api';
import { factionLabel } from '@/lib/factions';
import { CardDetailDrawer } from '@/components/CardDetailDrawer';

/**
 * Art Pack 01: the 6 flagship cards, one Legendary per faction - see docs/art-bible-01.md for
 * the full selection rationale. Hardcoded on purpose (not derived from a "flagship" DB flag,
 * which doesn't exist and shouldn't be invented for a one-time 6-card review) - this list is
 * inherently a curated, human decision, not a query.
 */
const FLAGSHIP_SLUGS = [
  'necromancer-of-the-twilight-order',
  'high-warden-of-the-white-rune',
  'matriarch-of-the-spring-light',
  'lord-of-the-nameless-shadow',
  'keeper-of-the-grey-mist',
  'lord-of-the-stellar-stream',
];

/**
 * Dev/admin-only review surface for Art Pack 01 - not linked from BottomNav/TopBar or any
 * player-facing navigation, reachable only by typing the URL. Shows each flagship card's full
 * artwork, its Card Frame 2.1 presentation, and the same Card Detail cinematic view a player
 * would see, side by side, so REVIEW CANDIDATE status can be judged without hunting through
 * Collection filters. Reads the public /api/cards catalog (already excludes archived legacy
 * cards) - no admin auth wired in, since nothing shown here is sensitive that /api/cards doesn't
 * already expose to every player.
 */
export default function ArtReviewPage() {
  const { data: cards, isLoading } = useQuery({ queryKey: ['cards'], queryFn: api.getCards });
  const [selected, setSelected] = useState<Card | null>(null);

  const flagshipCards = FLAGSHIP_SLUGS.map((slug) => cards?.find((c) => c.slug === slug)).filter(
    (c): c is Card => Boolean(c),
  );

  return (
    <div className="flex flex-col gap-6 pb-10 pt-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Art Pack 01 — Review</h1>
        <p className="mt-1 text-sm text-raido-mist">
          DEV/ADMIN ONLY. 6 flagship cards (1 Legendary per faction) — см.{' '}
          <code className="text-raido-white">docs/art-bible-01.md</code>. Статус карт ниже:{' '}
          <strong className="text-raido-white">REVIEW CANDIDATE</strong>, не FINAL APPROVED.
        </p>
      </div>

      {isLoading ? (
        <p className="text-sm text-raido-mist">Загрузка…</p>
      ) : flagshipCards.length === 0 ? (
        <p className="text-sm text-raido-mist">Ни одна flagship-карта не найдена в каталоге.</p>
      ) : (
        <div className="flex flex-col gap-8">
          {flagshipCards.map((card) => (
            <section key={card.id} className="rounded-2xl border border-white/10 bg-raido-graphite/40 p-4">
              <RuneDivider label={factionLabel(card.faction)} className="mb-3" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-[auto_1fr]">
                <div className="flex flex-col items-center gap-2">
                  <CardView card={card} size="lg" onSelect={setSelected} />
                  <button
                    type="button"
                    onClick={() => setSelected(card)}
                    className="text-xs text-raido-mist underline underline-offset-2 hover:text-raido-white"
                  >
                    Открыть Card Detail
                  </button>
                </div>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  <dt className="text-raido-mist">slug</dt>
                  <dd className="text-raido-white">{card.slug}</dd>
                  <dt className="text-raido-mist">Редкость</dt>
                  <dd className="text-raido-white">{RARITY_LABEL[card.rarity]}</dd>
                  <dt className="text-raido-mist">rightsStatus</dt>
                  <dd className="text-raido-white">{card.rightsStatus}</dd>
                  <dt className="text-raido-mist">artworkUrl</dt>
                  <dd className="truncate text-raido-white" title={card.artworkUrl}>
                    {card.artworkUrl.startsWith('data:') ? 'placeholder SVG (data URI)' : card.artworkUrl}
                  </dd>
                  <dt className="text-raido-mist">subFactions</dt>
                  <dd className="text-raido-white">{card.subFactions.join(', ') || '—'}</dd>
                  <dt className="text-raido-mist">archetypeTags</dt>
                  <dd className="text-raido-white">{card.archetypeTags.join(', ') || '—'}</dd>
                </dl>
              </div>
            </section>
          ))}
        </div>
      )}

      <CardDetailDrawer card={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
