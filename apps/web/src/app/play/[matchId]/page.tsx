'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '@kod-raido/ui';
import type { MatchEventView, MatchRewards, MatchStateView, UnitInstanceView } from '@kod-raido/shared';
import { api, ApiError, type MatchActionInput } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';
import { MatchBoard, type MatchSelection } from '@/components/MatchBoard';

export default function MatchPage() {
  const params = useParams<{ matchId: string }>();
  const matchId = params.matchId;
  const accessToken = useAuthStore((s) => s.accessToken);

  const { data, isLoading, error: loadError } = useQuery({
    queryKey: ['match', matchId, accessToken],
    queryFn: () => api.getMatch(accessToken as string, matchId),
    enabled: Boolean(accessToken && matchId),
    retry: false,
  });

  const [view, setView] = useState<MatchStateView | null>(null);
  const [events, setEvents] = useState<MatchEventView[]>([]);
  const [rewards, setRewards] = useState<MatchRewards | null>(null);
  const [selection, setSelection] = useState<MatchSelection>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    if (data) setView(data);
  }, [data]);

  const actionMutation = useMutation({
    mutationFn: (action: MatchActionInput) =>
      api.sendMatchAction(accessToken as string, matchId, action),
    onSuccess: (result) => {
      setView(result.view);
      setEvents((prev) => [...prev, ...result.events].slice(-40));
      setSelection(null);
      setActionError(null);
      if (result.rewards) setRewards(result.rewards);
    },
    onError: (err) => {
      setActionError(err instanceof ApiError ? err.message : 'Действие не удалось.');
    },
  });

  const isMyTurn = Boolean(view && !view.finished && view.activePlayerId === view.you.playerId);
  const pending = actionMutation.isPending;

  function selectHandCard(instanceId: string, cost: number) {
    if (!isMyTurn || pending) return;
    setSelection((prev) =>
      prev?.kind === 'hand' && prev.instanceId === instanceId
        ? null
        : { kind: 'hand', instanceId, cost },
    );
  }

  function selectOwnUnit(unit: UnitInstanceView) {
    if (!isMyTurn || pending || !view) return;
    if (selection?.kind === 'hand') {
      actionMutation.mutate({
        type: 'PLAY_CARD',
        cardId: selection.instanceId,
        targetId: unit.instanceId,
      });
      return;
    }
    const isReady = view.you.board.some(
      (u) => u.instanceId === unit.instanceId && !u.summonedThisTurn && !u.attackedThisTurn,
    );
    if (!isReady) return;
    setSelection((prev) =>
      prev?.kind === 'unit' && prev.instanceId === unit.instanceId
        ? null
        : { kind: 'unit', instanceId: unit.instanceId },
    );
  }

  function tapOwnConductor() {
    if (!isMyTurn || pending || !view || selection?.kind !== 'hand') return;
    actionMutation.mutate({
      type: 'PLAY_CARD',
      cardId: selection.instanceId,
      targetId: view.you.playerId,
    });
  }

  function tapEnemyUnit(unit: UnitInstanceView) {
    if (!isMyTurn || pending || !view || !selection) return;
    if (selection.kind === 'hand') {
      actionMutation.mutate({
        type: 'PLAY_CARD',
        cardId: selection.instanceId,
        targetId: unit.instanceId,
      });
    } else {
      actionMutation.mutate({
        type: 'ATTACK',
        attackerId: selection.instanceId,
        targetId: unit.instanceId,
      });
    }
  }

  function tapEnemyConductor() {
    if (!isMyTurn || pending || !view || !selection) return;
    if (selection.kind === 'hand') {
      actionMutation.mutate({
        type: 'PLAY_CARD',
        cardId: selection.instanceId,
        targetId: view.opponent.playerId,
      });
    } else {
      actionMutation.mutate({
        type: 'ATTACK',
        attackerId: selection.instanceId,
        targetId: view.opponent.playerId,
      });
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

  if (isLoading) {
    return <p className="pt-16 text-center text-sm text-raido-mist">Загружаем матч…</p>;
  }

  if (loadError || !view) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 pt-16 text-center">
        <h1 className="font-display text-xl font-bold">Матч не найден</h1>
        <p className="text-sm text-raido-mist">
          Возможно, он уже завершился или истёк по времени.
        </p>
        <Link href="/play">
          <Button>Начать новый бой</Button>
        </Link>
      </div>
    );
  }

  return (
    <MatchBoard
      view={view}
      events={events}
      rewards={rewards}
      selection={selection}
      isMyTurn={isMyTurn}
      pending={pending}
      actionError={actionError}
      opponentName="Бот"
      opponentIcon="🤖"
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
  );
}
