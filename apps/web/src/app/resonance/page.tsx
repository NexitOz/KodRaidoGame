import { ResonanceBadge } from '@kod-raido/ui';
import type { ResonanceTier } from '@kod-raido/shared';

const TIERS: ResonanceTier[] = [0, 1, 2, 3, 4, 5];

export default function ResonancePage() {
  return (
    <div className="flex flex-col gap-6 pt-4">
      <div>
        <h1 className="font-display text-2xl font-bold">Пульс Райдо</h1>
        <p className="mt-2 max-w-xl text-sm text-raido-mist">
          Здесь будут собираться растущие треки, карточки дня и события сообщества «Код Райдо».
          Импорт реальных метрик (прослушивания, лайки, репосты, комментарии) и еженедельный
          пересчёт Resonance Tier запланированы в Phase 5 дорожной карты.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-raido-graphite p-5">
        <h2 className="mb-3 font-display text-lg font-semibold">Шкала Resonance Tier</h2>
        <div className="flex flex-wrap gap-3">
          {TIERS.map((tier) => (
            <ResonanceBadge key={tier} tier={tier} />
          ))}
        </div>
        <p className="mt-3 text-xs text-raido-mist">
          В Ranked-режиме Tier даёт не более +10% к силе карты — колода и решения игрока всегда
          важнее хайпа.
        </p>
      </div>
    </div>
  );
}
