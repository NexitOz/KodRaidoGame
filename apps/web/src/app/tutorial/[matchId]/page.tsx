'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@kod-raido/ui';
import type { Card, MatchEventView, MatchStateView, TutorialProgress, UnitInstanceView } from '@kod-raido/shared';
import { api, ApiError, type MatchActionInput } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';
import { playSfx } from '@/lib/sfx';
import { playSfxForEvents } from '@/lib/match-sfx';
import { MatchBoard, type MatchSelection } from '@/components/MatchBoard';
import { TutorialOverlay } from '@/components/battlefield/TutorialOverlay';
import {
  evaluateAutoAdvance,
  nextStep,
  resolveResumeStep,
  stepAtIndex,
  stepIndexOf,
  TUTORIAL_STEP_CONTENT,
  TUTORIAL_STEPS,
  type TutorialStepId,
} from '@/lib/tutorial-objectives';

/** DONE is a terminal marker, not a displayed step - "Шаг 8 из 8", not "9 из 9". */
const DISPLAYED_STEP_COUNT = TUTORIAL_STEPS.length - 1;

export default function TutorialMatchPage() {
  const params = useParams<{ matchId: string }>();
  const matchId = params.matchId;
  const router = useRouter();
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((s) => s.accessToken);

  const {
    data: matchData,
    isLoading,
    error: loadError,
  } = useQuery({
    queryKey: ['match', matchId, accessToken],
    queryFn: () => api.getMatch(accessToken as string, matchId),
    enabled: Boolean(accessToken && matchId),
    retry: false,
  });
  const { data: progress } = useQuery({
    queryKey: ['tutorial-progress', accessToken],
    queryFn: () => api.getTutorialProgress(accessToken as string),
    enabled: Boolean(accessToken),
  });
  const { data: cards } = useQuery({ queryKey: ['cards'], queryFn: api.getCards });
  const cardsById = useMemo(() => new Map<string, Card>((cards ?? []).map((c) => [c.id, c])), [cards]);

  const [view, setView] = useState<MatchStateView | null>(null);
  const [events, setEvents] = useState<MatchEventView[]>([]);
  const [selection, setSelection] = useState<MatchSelection>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [step, setStep] = useState<TutorialStepId | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const resolvedInitialStep = useRef(false);
  const completeCalled = useRef(false);

  useEffect(() => {
    if (matchData) setView(matchData);
  }, [matchData]);

  useEffect(() => {
    if (!view || !progress || resolvedInitialStep.current) return;
    resolvedInitialStep.current = true;
    const persisted = stepAtIndex(progress.currentStep ?? 0);
    setStep(resolveResumeStep(persisted, view));
  }, [view, progress]);

  const saveStepMutation = useMutation({
    mutationFn: (stepIndex: number) => api.saveTutorialStep(accessToken as string, stepIndex),
  });

  function advanceTo(next: TutorialStepId) {
    setStep(next);
    setAttemptCount(0);
    saveStepMutation.mutate(stepIndexOf(next));
  }

  const completeMutation = useMutation({
    mutationFn: () => api.completeTutorial(accessToken as string),
    onSuccess: (result) => {
      // Clearing activeMatchId here matters, not just cosmetically: this match's row is already
      // FINISHED server-side (finishTutorialMatch ran synchronously when the winning action was
      // applied), so the Home/Settings CTA (useTutorialCta) must stop considering it "active" the
      // moment we know that too - otherwise the cached (now stale) activeMatchId would keep
      // offering "Продолжить обучение" for a match that's already over.
      queryClient.setQueryData<TutorialProgress | undefined>(['tutorial-progress', accessToken], (prev) =>
        prev
          ? { ...prev, completedAt: new Date().toISOString(), rewardClaimed: true, activeMatchId: undefined }
          : prev,
      );
      router.push(`/tutorial/victory?xp=${result.xp}&currency=${result.softCurrency}`);
    },
  });

  const actionMutation = useMutation({
    mutationFn: (action: MatchActionInput) => api.sendMatchAction(accessToken as string, matchId, action),
    onSuccess: (result) => {
      setView(result.view);
      setEvents((prev) => [...prev, ...result.events].slice(-40));
      setSelection(null);
      setActionError(null);

      if (step && step !== 'DONE') {
        const content = TUTORIAL_STEP_CONTENT[step];
        if (content.advanceKind === 'auto' && evaluateAutoAdvance(step, result.events, result.view, cardsById)) {
          advanceTo(nextStep(step));
        }
      }

      if (result.view.finished) {
        playSfx(result.view.winnerId === result.view.you.playerId ? 'match-win' : 'match-loss');
      } else {
        playSfxForEvents(result.events);
      }
    },
    onError: (err) => {
      setActionError(err instanceof ApiError ? err.message : 'Действие не удалось.');
      setAttemptCount((n) => n + 1);
    },
  });

  useEffect(() => {
    if (!view?.finished || completeCalled.current) return;
    if (view.winnerId !== view.you.playerId) return;
    completeCalled.current = true;
    completeMutation.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view?.finished, view?.winnerId]);

  const retryMutation = useMutation({
    mutationFn: () => api.startTutorial(accessToken as string),
    onSuccess: (result) => {
      queryClient.setQueryData(['tutorial-progress', accessToken], result);
      router.push(`/tutorial/${result.matchId}`);
    },
  });

  const isMyTurn = Boolean(view && !view.finished && view.activePlayerId === view.you.playerId);
  const pending = actionMutation.isPending;

  function selectHandCard(instanceId: string, cost: number) {
    if (!isMyTurn || pending) return;
    setSelection((prev) =>
      prev?.kind === 'hand' && prev.instanceId === instanceId ? null : { kind: 'hand', instanceId, cost },
    );
  }

  function selectOwnUnit(unit: UnitInstanceView) {
    if (!isMyTurn || pending || !view) return;
    if (selection?.kind === 'hand') {
      actionMutation.mutate({ type: 'PLAY_CARD', cardId: selection.instanceId, targetId: unit.instanceId });
      return;
    }
    const isReady = view.you.board.some(
      (u) => u.instanceId === unit.instanceId && !u.summonedThisTurn && !u.attackedThisTurn,
    );
    if (!isReady) return;
    setSelection((prev) =>
      prev?.kind === 'unit' && prev.instanceId === unit.instanceId ? null : { kind: 'unit', instanceId: unit.instanceId },
    );
  }

  function tapOwnConductor() {
    if (!isMyTurn || pending || !view || selection?.kind !== 'hand') return;
    actionMutation.mutate({ type: 'PLAY_CARD', cardId: selection.instanceId, targetId: view.you.playerId });
  }

  function tapEnemyUnit(unit: UnitInstanceView) {
    if (!isMyTurn || pending || !view || !selection) return;
    if (selection.kind === 'hand') {
      actionMutation.mutate({ type: 'PLAY_CARD', cardId: selection.instanceId, targetId: unit.instanceId });
    } else {
      actionMutation.mutate({ type: 'ATTACK', attackerId: selection.instanceId, targetId: unit.instanceId });
    }
  }

  function tapEnemyConductor() {
    if (!isMyTurn || pending || !view || !selection) return;
    if (selection.kind === 'hand') {
      actionMutation.mutate({ type: 'PLAY_CARD', cardId: selection.instanceId, targetId: view.opponent.playerId });
    } else {
      actionMutation.mutate({ type: 'ATTACK', attackerId: selection.instanceId, targetId: view.opponent.playerId });
    }
  }

  function confirmPlayNoTarget() {
    if (!isMyTurn || pending || selection?.kind !== 'hand') return;
    actionMutation.mutate({ type: 'PLAY_CARD', cardId: selection.instanceId });
  }

  function endTurn() {
    if (!isMyTurn || pending) return;
    actionMutation.mutate({ type: 'END_TURN' });
  }

  if (isLoading || !step) {
    return <p className="pt-16 text-center text-sm text-raido-mist">Загружаем обучение…</p>;
  }

  if (loadError || !view) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 pt-16 text-center">
        <h1 className="font-display text-xl font-bold">Обучающий матч не найден</h1>
        <p className="text-sm text-raido-mist">Возможно, он уже завершился или истёк по времени.</p>
        <Button onClick={() => retryMutation.mutate()} disabled={retryMutation.isPending}>
          {retryMutation.isPending ? 'Начинаем…' : 'Начать заново'}
        </Button>
      </div>
    );
  }

  if (view.finished && view.winnerId !== view.you.playerId) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 pt-16 text-center">
        <h1 className="font-display text-xl font-bold">Учебный бой не удался</h1>
        <p className="text-sm text-raido-mist">Такое бывает редко — давай попробуем ещё раз.</p>
        <Button onClick={() => retryMutation.mutate()} disabled={retryMutation.isPending}>
          {retryMutation.isPending ? 'Начинаем…' : 'Попробовать снова'}
        </Button>
      </div>
    );
  }

  if (view.finished) {
    return <p className="pt-16 text-center text-sm text-raido-mist">Резонанс услышал тебя…</p>;
  }

  return (
    <>
      <MatchBoard
        view={view}
        events={events}
        rewards={null}
        selection={selection}
        isMyTurn={isMyTurn}
        pending={pending}
        actionError={actionError}
        opponentName="Бот"
        opponentIcon="bot"
        opponentTurnLabel="Ход бота"
        rematchHref="/play"
        onSelectHand={selectHandCard}
        onSelectOwnUnit={selectOwnUnit}
        onTapOwnConductor={tapOwnConductor}
        onTapEnemyUnit={tapEnemyUnit}
        onTapEnemyConductor={tapEnemyConductor}
        onConfirmPlayNoTarget={confirmPlayNoTarget}
        onEndTurn={endTurn}
      />
      {step !== 'DONE' ? (
        <TutorialOverlay
          content={TUTORIAL_STEP_CONTENT[step]}
          stepNumber={stepIndexOf(step) + 1}
          stepCount={DISPLAYED_STEP_COUNT}
          attemptCount={attemptCount}
          onAdvance={() => advanceTo(nextStep(step))}
          onManualAdvance={() => advanceTo(nextStep(step))}
        />
      ) : null}
    </>
  );
}
