'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import type { ResonanceTier } from '@kod-raido/shared';
import { ResonanceBadge } from '@kod-raido/ui';
import { api } from '@/lib/api';
import { ResonanceSparkline } from '@/components/ResonanceSparkline';

const TIERS: ResonanceTier[] = [0, 1, 2, 3, 4, 5];

export default function ResonancePage() {
  const { data: all, isLoading } = useQuery({
    queryKey: ['resonance'],
    queryFn: api.getResonance,
  });
  const { data: trending } = useQuery({
    queryKey: ['resonance-trending'],
    queryFn: api.getResonanceTrending,
  });

  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const { data: history } = useQuery({
    queryKey: ['resonance-history', expandedCardId],
    queryFn: () => api.getResonanceHistory(expandedCardId as string),
    enabled: Boolean(expandedCardId),
  });

  const sorted = [...(all ?? [])].sort((a, b) => b.score - a.score);
  const trendingIds = new Set((trending ?? []).map((c) => c.cardId));

  return (
    <div className="flex flex-col gap-6 pt-4">
      <div>
        <h1 className="font-display text-2xl font-bold">Пульс Райдо</h1>
        <p className="mt-2 max-w-xl text-sm text-raido-mist">
          Resonance Tier каждой карты считается по реальному хайпу вокруг связанных треков —
          прослушивания, лайки, репосты, комментарии за последние 7 дней против предыдущих 7. В
          Ranked это даёт не более +10% к силе карты — колода и решения игрока всегда важнее хайпа.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-raido-graphite p-5">
        <h2 className="mb-3 font-display text-lg font-semibold">Шкала Resonance Tier</h2>
        <div className="flex flex-wrap gap-3">
          {TIERS.map((tier) => (
            <ResonanceBadge key={tier} tier={tier} />
          ))}
        </div>
      </div>

      {trending && trending.length > 0 ? (
        <div>
          <h2 className="mb-3 font-display text-lg font-semibold">Растёт прямо сейчас</h2>
          <div className="flex flex-wrap gap-2">
            {trending.map((card) => (
              <div
                key={card.cardId}
                className="flex items-center gap-2 rounded-full border border-raido-red/40 bg-raido-red/10 px-3 py-1.5 text-sm"
              >
                <span className="font-medium text-raido-white">{card.name}</span>
                <ResonanceBadge tier={card.tier} trending />
                {typeof card.scoreDelta === 'number' ? (
                  <span className="text-xs text-raido-redGlow">+{card.scoreDelta.toFixed(0)}</span>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div>
        <h2 className="mb-3 font-display text-lg font-semibold">Все карты</h2>
        {isLoading ? (
          <p className="text-sm text-raido-mist">Загружаем данные…</p>
        ) : sorted.length === 0 ? (
          <p className="text-sm text-raido-mist">Пока нет карт с рассчитанным резонансом.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {sorted.map((card) => {
              const expanded = expandedCardId === card.cardId;
              return (
                <div key={card.cardId} className="rounded-xl border border-white/10 bg-raido-graphite/60">
                  <button
                    type="button"
                    onClick={() => setExpandedCardId(expanded ? null : card.cardId)}
                    className="flex w-full min-h-14 items-center justify-between gap-3 px-4 py-2 text-left"
                  >
                    <div className="flex items-center gap-3">
                      {trendingIds.has(card.cardId) && !expanded ? (
                        <span className="text-raido-redGlow" aria-hidden>
                          ▲
                        </span>
                      ) : null}
                      <span className="font-medium text-raido-white">{card.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-raido-mist">
                      <span>Score {card.score.toFixed(0)}</span>
                      {card.boostPercent > 0 ? (
                        <span className="text-emerald-300">+{card.boostPercent}% в Ranked</span>
                      ) : null}
                      <ResonanceBadge tier={card.tier} />
                    </div>
                  </button>
                  {expanded ? (
                    <div className={clsx('border-t border-white/10 px-4 py-3')}>
                      {history ? (
                        <ResonanceSparkline points={history.map((point) => point.score)} />
                      ) : (
                        <p className="py-3 text-xs text-raido-mist">Загружаем историю…</p>
                      )}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
