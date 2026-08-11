'use client';

import Link from 'next/link';
import clsx from 'clsx';
import { Button, RuneDivider } from '@kod-raido/ui';
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
      <div
        className={clsx(
          'animate-card-in flex w-full max-w-sm flex-col items-center gap-4 rounded-2xl border bg-gradient-to-b from-raido-graphite to-raido-black p-6 text-center shadow-panel',
          won ? 'border-raido-gold/40' : 'border-white/10',
        )}
      >
        <span
          className={clsx(
            'animate-resonance-pulse flex h-14 w-14 items-center justify-center rounded-full border text-2xl',
            won ? 'border-raido-gold/60 text-raido-gold shadow-legendary' : 'border-raido-mist/40 text-raido-mist',
          )}
          aria-hidden="true"
        >
          ᚱ
        </span>
        <h2 className="font-display text-2xl font-bold uppercase tracking-wide">{won ? 'Победа' : 'Поражение'}</h2>
        <RuneDivider className="w-full" />

        {rewards ? (
          <>
            <dl className="grid w-full grid-cols-2 gap-2 text-sm">
              <div className="rounded-lg bg-black/30 p-2">
                <dt className="text-[11px] uppercase tracking-wide text-raido-mist">Опыт</dt>
                <dd className="text-base font-bold" data-testid="reward-xp">
                  +{rewards.xp}
                </dd>
              </div>
              <div className="rounded-lg bg-black/30 p-2">
                <dt className="text-[11px] uppercase tracking-wide text-raido-mist">Эхо</dt>
                <dd className="text-base font-bold" data-testid="reward-currency">
                  +{rewards.softCurrency}
                </dd>
              </div>

              {rewards.firstWinBonus ? (
                <div
                  data-testid="reward-first-win-bonus"
                  className="col-span-2 rounded-lg border border-raido-gold/40 bg-raido-gold/10 p-2 text-sm font-semibold text-raido-gold"
                >
                  Первая победа дня · +50 XP · +50 Эхо
                </div>
              ) : null}

              {hasMmr ? (
                <div className="col-span-2 rounded-lg bg-black/30 p-2">
                  <dt className="text-[11px] uppercase tracking-wide text-raido-mist">Рейтинг</dt>
                  <dd className="text-base font-bold">
                    {rewards!.mmrDelta! >= 0 ? '+' : ''}
                    {rewards!.mmrDelta}
                    {newRank ? ` · ${newRank.label}` : ''}
                  </dd>
                  {rankChanged ? (
                    <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-raido-gold">
                      Новый ранг!
                    </p>
                  ) : null}
                </div>
              ) : null}

              {rewards.leveledUp ? (
                <div
                  data-testid="reward-level-up"
                  className="relative col-span-2 flex flex-col items-center gap-0.5 overflow-hidden rounded-lg border border-raido-gold/40 bg-raido-gold/10 p-3"
                >
                  <span
                    aria-hidden="true"
                    className="animate-level-up-ring absolute h-16 w-16 rounded-full border-2 border-raido-red"
                  />
                  <span className="relative font-display text-lg font-bold uppercase tracking-wide text-raido-gold">
                    Уровень {rewards.newLevel}
                  </span>
                  <span className="relative text-[11px] text-raido-mist">Новый уровень!</span>
                </div>
              ) : null}
            </dl>

            <div className="w-full text-left">
              <div className="mb-1 flex items-center justify-between text-[11px] uppercase tracking-wide text-raido-mist">
                <span>Уровень {rewards.newLevel}</span>
                <span>
                  {rewards.nextLevelXp === null
                    ? 'Макс. уровень'
                    : `${rewards.currentLevelXp} / ${rewards.nextLevelXp}`}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-black/40">
                <div
                  className="h-full rounded-full bg-raido-red transition-[width] duration-500"
                  style={{ width: `${rewards.progressPercent}%` }}
                />
              </div>
            </div>

            {rewards.rewardsUnlocked.length > 0 ? (
              <div className="flex w-full flex-col gap-1.5">
                {rewards.rewardsUnlocked.map((reward) => (
                  <div
                    key={reward.level}
                    className="flex items-center justify-between rounded-lg border border-raido-violet/30 bg-raido-violet/10 px-3 py-1.5 text-xs"
                  >
                    <span className="text-raido-mist">Награда уровня {reward.level}</span>
                    <span className="font-semibold text-raido-white">
                      {reward.type === 'CURRENCY' ? `+${reward.amount} Эхо` : reward.label}
                    </span>
                  </div>
                ))}
              </div>
            ) : null}
          </>
        ) : null}

        <div className="flex flex-wrap justify-center gap-3">
          <Link href={rematchHref}>
            <Button>Сыграть ещё</Button>
          </Link>
          <Link href="/collection">
            <Button variant="secondary">Коллекция</Button>
          </Link>
          <Link href="/">
            <Button variant="secondary">Главная</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
