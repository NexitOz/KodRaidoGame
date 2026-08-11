'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Button, PremiumPanel, RuneDivider } from '@kod-raido/ui';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';

function XpBar({
  level,
  currentLevelXp,
  nextLevelXp,
  progressPercent,
}: {
  level: number;
  currentLevelXp: number;
  nextLevelXp: number | null;
  progressPercent: number;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="font-display text-xl font-bold" data-testid="profile-level">
          Уровень {level}
        </span>
        <span className="text-sm text-raido-mist">
          {nextLevelXp === null ? 'Максимальный уровень' : `${currentLevelXp} / ${nextLevelXp} XP`}
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-black/40">
        <div
          className="h-full rounded-full bg-raido-red transition-[width] duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg bg-black/30 p-3 text-center">
      <div className="text-lg font-bold">{value}</div>
      <div className="text-[11px] uppercase tracking-wide text-raido-mist">{label}</div>
    </div>
  );
}

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);

  const { data: progression, isLoading: progressionLoading } = useQuery({
    queryKey: ['progression', accessToken],
    queryFn: () => api.getProgression(accessToken as string),
    enabled: Boolean(accessToken),
  });

  const { data: history } = useQuery({
    queryKey: ['matches', accessToken],
    queryFn: () => api.getMatchHistory(accessToken as string),
    enabled: Boolean(accessToken),
  });

  if (!user) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 pt-16 text-center">
        <h1 className="font-display text-2xl font-bold">Профиль доступен после входа</h1>
        <div className="flex gap-3">
          <Link href="/login">
            <Button variant="secondary">Войти</Button>
          </Link>
          <Link href="/register">
            <Button>Регистрация</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6">
      <h1 className="font-display text-2xl font-bold">Профиль</h1>

      {progressionLoading || !progression ? (
        <p className="text-sm text-raido-mist">Загружаем прогресс…</p>
      ) : (
        <>
          <PremiumPanel tone="raido" className="flex flex-col gap-4 p-5">
            <XpBar
              level={progression.level}
              currentLevelXp={progression.currentLevelXp}
              nextLevelXp={progression.nextLevelXp}
              progressPercent={progression.progressPercent}
            />

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-lg bg-black/30 p-2">
                <div className="text-[11px] uppercase tracking-wide text-raido-mist">Эхо</div>
                <div className="text-base font-bold" data-testid="profile-currency">
                  {progression.softCurrency}
                </div>
              </div>
              <div className="rounded-lg bg-black/30 p-2">
                <div className="text-[11px] uppercase tracking-wide text-raido-mist">Первая победа дня</div>
                <div className={progression.firstWinClaimedToday ? 'text-base font-bold text-raido-mist' : 'text-base font-bold text-raido-gold'}>
                  {progression.firstWinClaimedToday ? 'Получена' : 'Не получена'}
                </div>
              </div>
            </div>

            {progression.nextReward ? (
              <div className="rounded-lg border border-raido-violet/30 bg-raido-violet/10 p-3 text-sm">
                <p className="text-raido-mist">
                  До уровня {progression.nextReward.level}: <span className="font-semibold text-raido-white">{progression.nextReward.xpNeeded} XP</span>
                </p>
                {progression.nextReward.reward ? (
                  <p className="mt-0.5 text-raido-mist">
                    Награда:{' '}
                    <span className="font-semibold text-raido-white">
                      {progression.nextReward.reward.type === 'CURRENCY'
                        ? `${progression.nextReward.reward.amount} Эхо`
                        : progression.nextReward.reward.label}
                    </span>
                  </p>
                ) : null}
              </div>
            ) : null}
          </PremiumPanel>

          <section className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            <StatTile label="Победы" value={progression.stats.wins} />
            <StatTile label="Поражения" value={progression.stats.losses} />
            <StatTile label="% побед" value={`${progression.stats.winRate}%`} />
            <StatTile label="PvE побед" value={progression.stats.pveWins} />
            <StatTile label="PvP побед" value={progression.stats.pvpWins} />
          </section>

          <section className="flex items-center justify-between rounded-lg bg-black/30 p-3 text-sm">
            <span className="text-raido-mist">Открыто косметики</span>
            <span className="font-semibold">{progression.unlockedCosmetics}</span>
          </section>
        </>
      )}

      <section>
        <RuneDivider label="Последние матчи" />
        {!history || history.length === 0 ? (
          <p className="mt-3 text-sm text-raido-mist">Матчей ещё не было — самое время сыграть.</p>
        ) : (
          <ul className="mt-3 flex flex-col gap-2">
            {history.slice(0, 10).map((match) => (
              <li
                key={match.id}
                className="flex items-center justify-between rounded-lg border border-white/5 bg-raido-graphite/60 px-3 py-2 text-sm"
              >
                <div className="flex flex-col">
                  <span className={match.won ? 'font-semibold text-raido-gold' : 'font-semibold text-raido-mist'}>
                    {match.won === null ? 'В процессе' : match.won ? 'Победа' : 'Поражение'}
                  </span>
                  <span className="text-[11px] text-raido-mist">{match.opponentLabel}</span>
                </div>
                <div className="text-right text-xs text-raido-mist">
                  <div>+{match.xpAwarded} XP</div>
                  <div>+{match.softCurrencyAwarded} Эхо</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
