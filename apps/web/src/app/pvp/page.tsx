'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { DECK_SIZE } from '@kod-raido/shared';
import { Button } from '@kod-raido/ui';
import type { Socket } from 'socket.io-client';
import { api, ApiError } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';
import { createMatchSocket } from '@/lib/socket';

export default function PvpPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);

  const { data: decks, isLoading } = useQuery({
    queryKey: ['decks', accessToken],
    queryFn: () => api.getDecks(accessToken as string),
    enabled: Boolean(accessToken),
  });

  const readyDecks = useMemo(
    () =>
      (decks ?? []).filter(
        (deck) => deck.cards.reduce((sum, c) => sum + c.quantity, 0) === DECK_SIZE,
      ),
    [decks],
  );

  const [deckId, setDeckId] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const activeDeckId = deckId ?? readyDecks[0]?.id ?? null;

  useEffect(() => {
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  async function startSearching() {
    if (!activeDeckId || !accessToken) return;
    setError(null);
    setSearching(true);

    const socket = createMatchSocket(accessToken);
    socketRef.current = socket;

    socket.on('connect_error', () => {
      setError('Не удалось подключиться к серверу боёв.');
      setSearching(false);
    });

    socket.on('match:found', (payload: { matchId: string }) => {
      router.push(`/pvp/${payload.matchId}`);
    });

    socket.once('connect', () => {
      api.joinMatchmaking(accessToken, activeDeckId).catch((err) => {
        setError(err instanceof ApiError ? err.message : 'Не удалось встать в очередь.');
        setSearching(false);
        socket.disconnect();
        socketRef.current = null;
      });
    });
  }

  async function cancelSearching() {
    setSearching(false);
    if (accessToken) {
      await api.leaveMatchmaking(accessToken).catch(() => undefined);
    }
    socketRef.current?.disconnect();
    socketRef.current = null;
  }

  if (!user) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 pt-16 text-center">
        <h1 className="font-display text-2xl font-bold">Бой с игроком доступен после входа</h1>
        <p className="text-sm text-raido-mist">
          Войди и собери колоду из 30 карт, чтобы найти соперника в рейтинговом бою.
        </p>
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

  if (searching) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-6 pt-16 text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-raido-red border-t-transparent" />
        <div>
          <h1 className="font-display text-xl font-bold">Ищем соперника…</h1>
          <p className="mt-1 text-sm text-raido-mist">
            Матч начнётся автоматически, как только найдётся пара.
          </p>
        </div>
        <Button variant="secondary" onClick={cancelSearching}>
          Отменить поиск
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Рейтинговый бой</h1>
          <p className="mt-1 text-sm text-raido-mist">
            {user.mmr} MMR · матчи считаются в общий рейтинг Iron → Raido.
          </p>
        </div>
        <Link href="/play" className="text-sm text-raido-red hover:underline">
          Бой с ботом →
        </Link>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-raido-mist">Колода</h2>
        {isLoading ? (
          <p className="text-sm text-raido-mist">Загружаем колоды…</p>
        ) : readyDecks.length === 0 ? (
          <div className="rounded-xl border border-raido-red/40 bg-raido-red/10 p-4 text-sm text-raido-redGlow">
            У тебя нет готовой колоды из {DECK_SIZE} карт.{' '}
            <Link href="/decks" className="underline">
              Собери колоду
            </Link>
            , чтобы найти соперника.
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {readyDecks.map((deck) => (
              <button
                key={deck.id}
                type="button"
                onClick={() => setDeckId(deck.id)}
                className={clsx(
                  'flex min-h-11 items-center justify-between rounded-lg border px-4 py-2 text-left text-sm font-medium transition-colors',
                  activeDeckId === deck.id
                    ? 'border-raido-red bg-raido-red/15 text-raido-red'
                    : 'border-white/10 text-raido-white hover:border-white/30',
                )}
              >
                <span>{deck.name}</span>
                <span className="text-xs text-raido-mist">{DECK_SIZE} карт</span>
              </button>
            ))}
          </div>
        )}
      </section>

      {error ? <p className="text-sm text-raido-redGlow">{error}</p> : null}

      <Button onClick={startSearching} disabled={!activeDeckId} className="w-full">
        Найти матч
      </Button>
    </div>
  );
}
