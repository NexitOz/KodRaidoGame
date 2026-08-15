'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';

export type TutorialCtaState = 'not-started' | 'in-progress' | 'completed';

const LABELS: Record<TutorialCtaState, string> = {
  'not-started': 'Пройти обучение',
  'in-progress': 'Продолжить обучение',
  completed: 'Пройти заново',
};

/**
 * Single source of truth for the tutorial's only two entry points (Home, Settings) - both query
 * the same `['tutorial-progress', accessToken]` cache, so there is no parallel progress system and
 * no automatic modal/banner/redirect anywhere else in the app. `activeMatchId` (an ACTIVE match
 * row) always wins over
 * `completedAt`: a user who finished once, then replayed and left mid-match, has a genuinely
 * resumable attempt that must be offered before "play again". Resuming navigates straight to the
 * existing match (same as the removed floating banner used to) so the tutorial page's own
 * `resolveResumeStep` picks up the saved `currentStep`; starting/replaying calls the real
 * `startTutorial` mutation, so progress only ever resets on this explicit click, never implicitly.
 */
export function useTutorialCta() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);

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

  if (!user || !progress) return null;

  const state: TutorialCtaState = progress.activeMatchId
    ? 'in-progress'
    : progress.completedAt
      ? 'completed'
      : 'not-started';

  function activate() {
    if (state === 'in-progress' && progress?.activeMatchId) {
      router.push(`/tutorial/${progress.activeMatchId}`);
      return;
    }
    startMutation.mutate();
  }

  return {
    state,
    label: startMutation.isPending ? 'Начинаем…' : LABELS[state],
    isPending: startMutation.isPending,
    activate,
  };
}
