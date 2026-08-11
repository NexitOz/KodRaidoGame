'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@kod-raido/ui';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';

/**
 * Shown once per account, the first time a logged-in user has never started,
 * skipped, or completed the tutorial (checked on every page load, not just
 * immediately after register/login - a returning user who never touched the
 * tutorial should still see it). Skipping is always allowed and never blocks
 * the rest of the app.
 */
export function OnboardingGate() {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const [skipConfirmed, setSkipConfirmed] = useState(false);

  const { data: progress } = useQuery({
    queryKey: ['tutorial-progress', accessToken],
    queryFn: () => api.getTutorialProgress(accessToken as string),
    enabled: Boolean(user && accessToken),
  });

  const startMutation = useMutation({
    mutationFn: () => api.startTutorial(accessToken as string),
    onSuccess: (result) => {
      queryClient.setQueryData(['tutorial-progress', accessToken], result);
      router.push(`/tutorial/${result.matchId}`);
    },
  });

  const skipMutation = useMutation({
    mutationFn: () => api.skipTutorial(accessToken as string),
    onSuccess: (result) => {
      queryClient.setQueryData(['tutorial-progress', accessToken], result);
      setSkipConfirmed(true);
    },
  });

  if (!user || !progress) return null;
  const untouched = !progress.startedAt && !progress.skippedAt && !progress.completedAt;

  // The skip confirmation is a one-shot transient screen shown right after the skip mutation
  // resolves. It must take priority over the branches below: the instant skipMutation succeeds,
  // progress.skippedAt is already set in the query cache, so "untouched" flips to false on the
  // very next render - without this check first, the confirmation would never be visible at all.
  if (skipConfirmed) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
      >
        <div className="animate-card-in flex w-full max-w-sm flex-col items-center gap-5 rounded-2xl border border-white/10 bg-raido-graphite p-6 text-center">
          <span className="text-3xl text-raido-red" aria-hidden="true">
            ᚱ
          </span>
          <p className="text-sm text-raido-mist">Ты сможешь пройти обучение позже в настройках.</p>
          <Button onClick={() => setSkipConfirmed(false)}>Понятно</Button>
        </div>
      </div>
    );
  }

  // A tutorial attempt is in progress but the user landed back on the app without its
  // /tutorial/[matchId] URL (closed the tab, lost the deep link, replayed from Settings and then
  // navigated away, etc). A small non-blocking banner offers the way back in - never a
  // full-screen blocking modal, per the "soft guidance" rule, and never fabricates progress: it
  // just re-opens the same real match.
  //
  // `activeMatchId` alone is the correct, sufficient signal here: the server only ever returns it
  // for a Match row that is still `status: 'ACTIVE'` (see TutorialService.getProgress) - a
  // finished match's row flips to FINISHED synchronously in the same request that reports the
  // win, so this can never point at a match that's actually already over. Gating it further on
  // `!completedAt && !skippedAt` was the bug: those two fields record *historical* facts about a
  // user's very first tutorial encounter and are never cleared by a later replay
  // (TutorialService.start() intentionally leaves them alone so progression/analytics keep an
  // accurate first-completion record) - so a user who skipped or completed once, then replayed
  // from Settings and left mid-match, would have a genuinely active attempt that this banner
  // could never show for. Never render it while already on that match's own page - it would
  // float on top of the Battlefield's hand and End Turn button, which is exactly the kind of
  // persistent on-field hint the tutorial overlay itself is designed to avoid.
  if (!untouched) {
    const onOwnTutorialMatch = pathname === `/tutorial/${progress.activeMatchId}`;
    if (progress.activeMatchId && !onOwnTutorialMatch) {
      return (
        <div className="fixed inset-x-0 bottom-16 z-40 flex justify-center px-4 md:bottom-4">
          <Link
            href={`/tutorial/${progress.activeMatchId}`}
            className="flex items-center gap-2 rounded-full border border-raido-gold/50 bg-raido-graphite/95 px-4 py-2 text-xs font-semibold text-raido-white shadow-rune"
          >
            <span aria-hidden="true">◈</span>
            Продолжить обучение
          </Link>
        </div>
      );
    }
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <div className="animate-card-in flex w-full max-w-sm flex-col items-center gap-5 rounded-2xl border border-white/10 bg-raido-graphite p-6 text-center">
        <span className="animate-resonance-pulse text-3xl text-raido-red" aria-hidden="true">
          ◈
        </span>
        <h1 id="onboarding-title" className="font-display text-2xl font-bold">
          Код Райдо: Резонанс
        </h1>
        <p className="text-sm italic leading-relaxed text-raido-mist">
          «Музыка рождает Резонанс.
          <br />
          Резонанс меняет карты.
          <br />А решаешь всё равно ты.»
        </p>
        <div className="flex w-full flex-col gap-2">
          <Button
            onClick={() => startMutation.mutate()}
            disabled={startMutation.isPending}
            className="w-full"
          >
            {startMutation.isPending ? 'Начинаем…' : 'Начать обучение'}
          </Button>
          <button
            type="button"
            onClick={() => skipMutation.mutate()}
            disabled={skipMutation.isPending}
            className="min-h-9 text-xs text-raido-mist underline-offset-2 hover:text-raido-white hover:underline disabled:opacity-50"
          >
            Пропустить
          </button>
        </div>
      </div>
    </div>
  );
}
