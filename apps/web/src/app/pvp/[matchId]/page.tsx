'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@kod-raido/ui';
import type {
  MatchActionInput,
  MatchEventView,
  MatchPresencePayload,
  MatchRewards,
  MatchStateView,
  UnitInstanceView,
} from '@kod-raido/shared';
import type { Socket } from 'socket.io-client';
import { useAuthStore } from '@/lib/auth-store';
import { createMatchSocket } from '@/lib/socket';
import { playSfx } from '@/lib/sfx';
import { playSfxForEvents } from '@/lib/match-sfx';
import { MatchBoard, type MatchSelection } from '@/components/MatchBoard';

type ConnectionState = 'connecting' | 'connected' | 'error';

export default function PvpMatchPage() {
  const params = useParams<{ matchId: string }>();
  const matchId = params.matchId;
  const accessToken = useAuthStore((s) => s.accessToken);

  const socketRef = useRef<Socket | null>(null);
  const [connection, setConnection] = useState<ConnectionState>('connecting');
  const [view, setView] = useState<MatchStateView | null>(null);
  const [events, setEvents] = useState<MatchEventView[]>([]);
  const [rewards, setRewards] = useState<MatchRewards | null>(null);
  const [selection, setSelection] = useState<MatchSelection>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [opponentGone, setOpponentGone] = useState<MatchPresencePayload | null>(null);

  useEffect(() => {
    if (!accessToken || !matchId) return undefined;

    const socket = createMatchSocket(accessToken);
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnection('connected');
      socket.emit('match:join', { matchId });
    });
    socket.on('connect_error', () => setConnection('error'));
    socket.on('disconnect', () => setConnection('connecting'));

    socket.on('match:state', (payload: { view: MatchStateView; events: MatchEventView[]; rewards?: MatchRewards }) => {
      setView(payload.view);
      setEvents((prev) => [...prev, ...payload.events].slice(-40));
      setPending(false);
      setSelection(null);
      setActionError(null);
      setOpponentGone(null);
      if (payload.rewards) setRewards(payload.rewards);

      if (payload.view.finished) {
        playSfx(payload.view.winnerId === payload.view.you.playerId ? 'match-win' : 'match-loss');
      } else {
        playSfxForEvents(payload.events);
      }
    });

    socket.on('match:error', (payload: { message: string }) => {
      setPending(false);
      if (view) setActionError(payload.message);
      else setJoinError(payload.message);
    });

    socket.on('match:opponent_disconnected', (payload: MatchPresencePayload) => {
      setOpponentGone(payload);
    });
    socket.on('match:opponent_reconnected', () => setOpponentGone(null));

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, matchId]);

  const isMyTurn = Boolean(view && !view.finished && view.activePlayerId === view.you.playerId);

  function sendAction(action: MatchActionInput) {
    if (!isMyTurn || pending || !socketRef.current) return;
    setPending(true);
    setActionError(null);
    socketRef.current.emit('match:action', { matchId, action });
  }

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
      sendAction({ type: 'PLAY_CARD', cardId: selection.instanceId, targetId: unit.instanceId });
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
    sendAction({ type: 'PLAY_CARD', cardId: selection.instanceId, targetId: view.you.playerId });
  }

  function tapEnemyUnit(unit: UnitInstanceView) {
    if (!isMyTurn || pending || !view || !selection) return;
    if (selection.kind === 'hand') {
      sendAction({ type: 'PLAY_CARD', cardId: selection.instanceId, targetId: unit.instanceId });
    } else {
      sendAction({ type: 'ATTACK', attackerId: selection.instanceId, targetId: unit.instanceId });
    }
  }

  function tapEnemyConductor() {
    if (!isMyTurn || pending || !view || !selection) return;
    if (selection.kind === 'hand') {
      sendAction({ type: 'PLAY_CARD', cardId: selection.instanceId, targetId: view.opponent.playerId });
    } else {
      sendAction({ type: 'ATTACK', attackerId: selection.instanceId, targetId: view.opponent.playerId });
    }
  }

  function confirmPlayNoTarget() {
    if (!isMyTurn || pending || selection?.kind !== 'hand') return;
    sendAction({ type: 'PLAY_CARD', cardId: selection.instanceId });
  }

  function endTurn() {
    if (!isMyTurn || pending) return;
    sendAction({ type: 'END_TURN' });
  }

  if (joinError) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 pt-16 text-center">
        <h1 className="font-display text-xl font-bold">Матч недоступен</h1>
        <p className="text-sm text-raido-mist">{joinError}</p>
        <Link href="/pvp">
          <Button>Найти новый матч</Button>
        </Link>
      </div>
    );
  }

  if (!view) {
    return (
      <p className="pt-16 text-center text-sm text-raido-mist">
        {connection === 'error' ? 'Не удалось подключиться к серверу боёв.' : 'Подключаемся к матчу…'}
      </p>
    );
  }

  const banner =
    opponentGone || connection !== 'connected' ? (
      <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
        {connection !== 'connected'
          ? 'Переподключаемся…'
          : `Соперник отключился. Ждём возвращения (до ${opponentGone!.graceSeconds}с), иначе засчитывается победа.`}
      </div>
    ) : null;

  return (
    <MatchBoard
      view={view}
      events={events}
      rewards={rewards}
      selection={selection}
      isMyTurn={isMyTurn}
      pending={pending}
      actionError={actionError}
      opponentName="Соперник"
      opponentIcon="⚔"
      opponentTurnLabel="Ход соперника"
      rematchHref="/pvp"
      onSelectHand={selectHandCard}
      onSelectOwnUnit={selectOwnUnit}
      onTapOwnConductor={tapOwnConductor}
      onTapEnemyUnit={tapEnemyUnit}
      onTapEnemyConductor={tapEnemyConductor}
      onConfirmPlayNoTarget={confirmPlayNoTarget}
      onEndTurn={endTurn}
      banner={banner}
    />
  );
}
