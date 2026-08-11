'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { DECK_SIZE, type Card } from '@kod-raido/shared';
import { Button, RuneDivider, factionAccent } from '@kod-raido/ui';
import { api, ApiError, type BotDifficulty } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';
import { EnergyCurve } from '@/components/EnergyCurve';
import { dominantFaction } from '@/lib/deck-select';
import { factionLabel } from '@/lib/factions';

const DIFFICULTIES: Array<{ value: BotDifficulty; label: string; description: string }> = [
  { value: 'EASY', label: 'Легко', description: 'Бот играет осторожно, редко меняется' },
  { value: 'NORMAL', label: 'Средне', description: 'Бот разменивается и атакует по приоритету' },
  { value: 'HARD', label: 'Сложно', description: 'Бот считает выгодные размены наперёд' },
];

export default function PlayPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);

  const { data: decks, isLoading } = useQuery({
    queryKey: ['decks', accessToken],
    queryFn: () => api.getDecks(accessToken as string),
    enabled: Boolean(accessToken),
  });
  const { data: allCards } = useQuery({ queryKey: ['cards'], queryFn: api.getCards });
  const cardsById = useMemo(() => {
    const map = new Map<string, Card>();
    for (const card of allCards ?? []) map.set(card.id, card);
    return map;
  }, [allCards]);

  const readyDecks = useMemo(
    () =>
      (decks ?? []).filter(
        (deck) => deck.cards.reduce((sum, c) => sum + c.quantity, 0) === DECK_SIZE,
      ),
    [decks],
  );

  const [deckId, setDeckId] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<BotDifficulty>('NORMAL');
  const [error, setError] = useState<string | null>(null);

  const activeDeckId = deckId ?? readyDecks[0]?.id ?? null;

  const startMutation = useMutation({
    mutationFn: () => {
      if (!activeDeckId) throw new Error('Choose a deck first.');
      return api.createPveMatch(accessToken as string, activeDeckId, difficulty);
    },
    onSuccess: (view) => router.push(`/play/${view.matchId}`),
    onError: (err) => setError(err instanceof ApiError ? err.message : 'Не удалось начать бой.'),
  });

  if (!user) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 pt-16 text-center">
        <h1 className="font-display text-2xl font-bold">Бой с ботом доступен после входа</h1>
        <p className="text-sm text-raido-mist">
          Войди и собери колоду из 30 карт, чтобы сыграть PvE-матч.
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

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Бой с ботом</h1>
        <Link href="/pvp" className="text-sm text-raido-red hover:underline">
          Рейтинговый бой →
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
            , чтобы начать бой.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {readyDecks.map((deck) => {
              const faction = dominantFaction(deck, cardsById);
              const accent = faction ? factionAccent(faction) : null;
              const topCards = [...deck.cards]
                .map((e) => cardsById.get(e.cardId))
                .filter((c): c is Card => Boolean(c))
                .sort((a, b) => b.rarity.localeCompare(a.rarity) || b.cost - a.cost)
                .slice(0, 3);
              const active = activeDeckId === deck.id;
              return (
                <button
                  key={deck.id}
                  type="button"
                  onClick={() => setDeckId(deck.id)}
                  className={clsx(
                    'group flex flex-col gap-3 rounded-panel border px-4 py-3 text-left transition-colors',
                    active ? 'border-raido-red bg-raido-red/10' : 'border-white/10 hover:border-white/25',
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      {accent ? (
                        <span aria-hidden className={clsx('text-sm', accent.textClass)}>
                          {accent.glyph}
                        </span>
                      ) : null}
                      <span className="text-sm font-semibold text-raido-white">{deck.name}</span>
                    </span>
                    <span className="text-xs text-raido-mist">{DECK_SIZE} карт</span>
                  </div>
                  {faction ? (
                    <p className="text-[11px] text-raido-mist">{factionLabel(faction)}</p>
                  ) : null}
                  <div className="flex items-end gap-3">
                    <div className="flex -space-x-3 transition-transform duration-200 group-hover:-space-x-1.5">
                      {topCards.map((card) => (
                        <img
                          key={card.id}
                          src={card.artworkUrl}
                          alt=""
                          className="h-14 w-11 flex-shrink-0 rounded-md border border-white/15 object-cover shadow-panel"
                        />
                      ))}
                    </div>
                    <div className="max-w-[9rem] flex-1">
                      <EnergyCurve entries={deck.cards} cardsById={cardsById} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      <RuneDivider />

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-raido-mist">Сложность бота</h2>
        <div className="grid gap-2 sm:grid-cols-3">
          {DIFFICULTIES.map((d) => (
            <button
              key={d.value}
              type="button"
              onClick={() => setDifficulty(d.value)}
              className={clsx(
                'flex flex-col gap-1 rounded-lg border px-3 py-2.5 text-left transition-colors',
                difficulty === d.value
                  ? 'border-raido-red bg-raido-red/15'
                  : 'border-white/10 hover:border-white/30',
              )}
            >
              <span className="text-sm font-semibold text-raido-white">{d.label}</span>
              <span className="text-[11px] text-raido-mist">{d.description}</span>
            </button>
          ))}
        </div>
      </section>

      {error ? <p className="text-sm text-raido-redGlow">{error}</p> : null}

      <Button
        onClick={() => startMutation.mutate()}
        disabled={!activeDeckId || startMutation.isPending}
        className="w-full"
      >
        {startMutation.isPending ? 'Начинаем бой…' : 'Начать бой'}
      </Button>
    </div>
  );
}
