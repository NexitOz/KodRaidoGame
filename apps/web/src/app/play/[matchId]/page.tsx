'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import type { MatchEventView, MatchStateView, UnitInstanceView } from '@kod-raido/shared';
import { Button, CardView } from '@kod-raido/ui';
import { api, ApiError, type MatchActionInput } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';
import { UnitToken } from '@/components/UnitToken';

type Selection =
  | { kind: 'hand'; instanceId: string; cost: number }
  | { kind: 'unit'; instanceId: string }
  | null;

const EVENT_LABEL: Record<string, string> = {
  CARD_PLAYED: 'сыграл карту',
  UNIT_SUMMONED: 'призвал существо',
  RUNE_ACTIVATED: 'активировал руну',
  ATTACK: 'атаковал',
  DAMAGE: 'нанёс урон',
  UNIT_DIED: 'существо погибло',
  CONDUCTOR_DAMAGED: 'урон по Проводнику',
  TURN_STARTED: 'начался ход',
  TURN_ENDED: 'ход завершён',
  DRAW: 'взял карту',
  FATIGUE: 'урон от истощения',
};

function eventLabel(event: MatchEventView): string {
  return EVENT_LABEL[event.type] ?? event.type;
}

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
  const [rewards, setRewards] = useState<{
    xp: number;
    softCurrency: number;
    leveledUp: boolean;
  } | null>(null);
  const [selection, setSelection] = useState<Selection>(null);
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

  const readyAttackers = useMemo(() => {
    if (!view) return new Set<string>();
    return new Set(
      view.you.board
        .filter((u) => !u.summonedThisTurn && !u.attackedThisTurn)
        .map((u) => u.instanceId),
    );
  }, [view]);

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
    if (!readyAttackers.has(unit.instanceId)) return;
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

  const { you, opponent } = view;
  const targetingEnemy = Boolean(selection);

  return (
    <div className="flex flex-col gap-4 pb-24">
      <header className="flex items-center justify-between text-xs text-raido-mist">
        <span>Ход {view.turn}</span>
        <span className={isMyTurn ? 'text-raido-red' : ''}>
          {isMyTurn ? 'Твой ход' : 'Ход бота'}
        </span>
      </header>

      <section className="flex flex-col gap-2 rounded-xl border border-white/10 bg-raido-graphite/60 p-3">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={tapEnemyConductor}
            disabled={!targetingEnemy}
            className={clsx(
              'flex items-center gap-2 rounded-lg px-2 py-1 text-left transition-colors',
              targetingEnemy && 'ring-1 ring-emerald-400/60',
            )}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-raido-black text-sm font-bold">
              🤖
            </span>
            <span className="text-sm">
              <span className="block font-semibold text-raido-white">Бот</span>
              <span className="text-raido-mist">
                ♥ {opponent.conductorHp} · ⚡ {opponent.energy}/{opponent.maxEnergy}
              </span>
            </span>
          </button>
          <span className="text-[11px] text-raido-mist">
            Рука {opponent.handCount} · Колода {opponent.deckCount}
          </span>
        </div>
        <div className="flex min-h-[72px] flex-wrap gap-1.5">
          {opponent.board.map((unit) => (
            <UnitToken
              key={unit.instanceId}
              unit={unit}
              targetable={targetingEnemy}
              onSelect={tapEnemyUnit}
            />
          ))}
        </div>
      </section>

      {events.length > 0 ? (
        <details className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs text-raido-mist">
          <summary className="cursor-pointer select-none font-semibold text-raido-white">
            Журнал событий
          </summary>
          <ul className="mt-2 flex flex-col gap-1">
            {events
              .slice(-15)
              .reverse()
              .map((e, i) => (
                <li key={i}>{eventLabel(e)}</li>
              ))}
          </ul>
        </details>
      ) : null}

      <section className="flex flex-col gap-2 rounded-xl border border-white/10 bg-raido-graphite/60 p-3">
        <div className="flex min-h-[72px] flex-wrap gap-1.5">
          {you.board.map((unit) => (
            <UnitToken
              key={unit.instanceId}
              unit={unit}
              selectable={readyAttackers.has(unit.instanceId)}
              selected={selection?.kind === 'unit' && selection.instanceId === unit.instanceId}
              targetable={selection?.kind === 'hand'}
              onSelect={selectOwnUnit}
            />
          ))}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-raido-mist">
            Колода {you.deckCount} · Сброс {you.discardCount}
          </span>
          <button
            type="button"
            onClick={tapOwnConductor}
            disabled={selection?.kind !== 'hand'}
            className={clsx(
              'flex items-center gap-2 rounded-lg px-2 py-1 transition-colors',
              selection?.kind === 'hand' && 'ring-1 ring-emerald-400/60',
            )}
          >
            <span className="text-sm">
              <span className="block text-right font-semibold text-raido-white">Ты</span>
              <span className="text-raido-mist">
                ♥ {you.conductorHp} · ⚡ {you.energy}/{you.maxEnergy}
              </span>
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-raido-black text-sm font-bold">
              🧑
            </span>
          </button>
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {you.hand.map(({ instanceId, card }) => (
            <div key={instanceId} className="shrink-0">
              <CardView
                card={card}
                size="sm"
                onSelect={() => selectHandCard(instanceId, card.cost)}
                className={clsx(
                  selection?.kind === 'hand' && selection.instanceId === instanceId
                    ? 'ring-2 ring-raido-red'
                    : '',
                  card.cost > you.energy && 'opacity-40',
                )}
              />
            </div>
          ))}
        </div>

        {actionError ? <p className="text-xs text-raido-redGlow">{actionError}</p> : null}

        <div className="flex gap-2">
          {selection?.kind === 'hand' ? (
            <Button
              variant="secondary"
              onClick={confirmPlayNoTarget}
              disabled={pending}
              className="flex-1"
            >
              Сыграть без цели
            </Button>
          ) : null}
          <Button onClick={endTurn} disabled={!isMyTurn || pending} className="flex-1">
            {pending ? 'Обработка…' : 'Завершить ход'}
          </Button>
        </div>
      </section>

      {view.finished ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 p-4">
          <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-2xl border border-white/10 bg-raido-graphite p-6 text-center">
            <h2 className="font-display text-2xl font-bold">
              {view.winnerId === you.playerId ? 'Победа!' : 'Поражение'}
            </h2>
            {rewards ? (
              <p className="text-sm text-raido-mist">
                +{rewards.xp} опыта · +{rewards.softCurrency} монет
                {rewards.leveledUp ? ' · Новый уровень!' : ''}
              </p>
            ) : null}
            <div className="flex gap-3">
              <Link href="/play">
                <Button>Играть снова</Button>
              </Link>
              <Link href="/collection">
                <Button variant="secondary">К коллекции</Button>
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
