'use client';

import Link from 'next/link';
import { Button } from '@kod-raido/ui';
import { rankForMmr, type MatchRewards } from '@kod-raido/shared';

export interface ResultModalProps {
  won: boolean;
  rewards: MatchRewards | null;
  rematchHref: string;
}

export function ResultModal({ won, rewards, rematchHref }: ResultModalProps) {
  const hasMmr = rewards && typeof rewards.mmrDelta === 'number' && typeof rewards.newMmr === 'number';
  const newRank = hasMmr ? rankForMmr(rewards!.newMmr!) : null;
  const oldRank = hasMmr ? rankForMmr(rewards!.newMmr! - rewards!.mmrDelta!) : null;
  const rankChanged = Boolean(newRank && oldRank && newRank.tier !== oldRank.tier);

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/85 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={won ? 'Победа' : 'Поражение'}
    >
      <div className="animate-card-in flex w-full max-w-sm flex-col items-center gap-4 rounded-2xl border border-white/10 bg-raido-graphite p-6 text-center">
        <span className="animate-resonance-pulse text-3xl text-raido-red" aria-hidden="true">
          ◈
        </span>
        <h2 className="font-display text-2xl font-bold">{won ? 'Победа!' : 'Поражение'}</h2>

        {rewards ? (
          <dl className="grid w-full grid-cols-2 gap-2 text-sm">
            <div className="rounded-lg bg-black/30 p-2">
              <dt className="text-[11px] uppercase tracking-wide text-raido-mist">Опыт</dt>
              <dd className="text-base font-bold">+{rewards.xp}</dd>
            </div>
            <div className="rounded-lg bg-black/30 p-2">
              <dt className="text-[11px] uppercase tracking-wide text-raido-mist">Монеты</dt>
              <dd className="text-base font-bold">+{rewards.softCurrency}</dd>
            </div>
            {hasMmr ? (
              <div className="col-span-2 rounded-lg bg-black/30 p-2">
                <dt className="text-[11px] uppercase tracking-wide text-raido-mist">Рейтинг</dt>
                <dd className="text-base font-bold">
                  {rewards!.mmrDelta! >= 0 ? '+' : ''}
                  {rewards!.mmrDelta}
                  {newRank ? ` · ${newRank.label}` : ''}
                  {rankChanged ? ' 🎉' : ''}
                </dd>
              </div>
            ) : null}
            {rewards.leveledUp ? (
              <div className="col-span-2 rounded-lg border border-raido-gold/40 bg-raido-gold/10 p-2 text-sm font-semibold text-raido-gold">
                Новый уровень!
              </div>
            ) : null}
          </dl>
        ) : null}

        <div className="flex gap-3">
          <Link href={rematchHref}>
            <Button>Играть снова</Button>
          </Link>
          <Link href="/collection">
            <Button variant="secondary">К коллекции</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
