'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { validateDeck } from '@kod-raido/game-engine';
import { DECK_SIZE, deckLimitForRarity, type Card, type DeckCardEntry } from '@kod-raido/shared';
import { Button, CardView } from '@kod-raido/ui';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';
import { EnergyCurve } from '@/components/EnergyCurve';
import { TagSynergy } from '@/components/TagSynergy';

type EntryMap = Map<string, number>;

function entriesFromMap(map: EntryMap): DeckCardEntry[] {
  return [...map.entries()]
    .filter(([, quantity]) => quantity > 0)
    .map(([cardId, quantity]) => ({ cardId, quantity }));
}

export default function DecksPage() {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const queryClient = useQueryClient();

  const { data: collection } = useQuery({
    queryKey: ['collection', accessToken],
    queryFn: () => api.getCollection(accessToken as string),
    enabled: Boolean(accessToken),
  });
  const { data: decks } = useQuery({
    queryKey: ['decks', accessToken],
    queryFn: () => api.getDecks(accessToken as string),
    enabled: Boolean(accessToken),
  });

  const cardsById = useMemo(() => {
    const map = new Map<string, Card>();
    for (const { card } of collection ?? []) map.set(card.id, card);
    return map;
  }, [collection]);

  const ownedQuantity = useMemo(() => {
    const map = new Map<string, number>();
    for (const { card, quantity } of collection ?? []) map.set(card.id, quantity);
    return map;
  }, [collection]);

  const [activeDeckId, setActiveDeckId] = useState<string | 'new' | null>(null);
  const [deckName, setDeckName] = useState('Новая колода');
  const [entries, setEntries] = useState<EntryMap>(new Map());
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!activeDeckId || activeDeckId === 'new') return;
    const deck = decks?.find((d) => d.id === activeDeckId);
    if (deck) {
      setDeckName(deck.name);
      setEntries(new Map(deck.cards.map((c) => [c.cardId, c.quantity])));
    }
  }, [activeDeckId, decks]);

  const totalCards = [...entries.values()].reduce((sum, q) => sum + q, 0);

  const validation = useMemo(
    () => validateDeck(entriesFromMap(entries), cardsById),
    [entries, cardsById],
  );

  const ownershipIssues = useMemo(() => {
    const issues: string[] = [];
    for (const [cardId, quantity] of entries) {
      const have = ownedQuantity.get(cardId) ?? 0;
      if (quantity > have) {
        const name = cardsById.get(cardId)?.name ?? cardId;
        issues.push(`${name}: используется ${quantity}, а в коллекции только ${have}.`);
      }
    }
    return issues;
  }, [entries, ownedQuantity, cardsById]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const input = { name: deckName, cards: entriesFromMap(entries) };
      if (activeDeckId && activeDeckId !== 'new') {
        return api.updateDeck(accessToken as string, activeDeckId, input);
      }
      return api.createDeck(accessToken as string, input);
    },
    onSuccess: (deck) => {
      queryClient.invalidateQueries({ queryKey: ['decks', accessToken] });
      setActiveDeckId(deck.id);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (deckId: string) => api.deleteDeck(accessToken as string, deckId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['decks', accessToken] });
      setActiveDeckId(null);
      setEntries(new Map());
      setDeckName('Новая колода');
    },
  });

  function startNewDeck() {
    setActiveDeckId('new');
    setDeckName('Новая колода');
    setEntries(new Map());
  }

  function adjustCard(cardId: string, delta: number) {
    setEntries((prev) => {
      const next = new Map(prev);
      const card = cardsById.get(cardId);
      const limit = card ? deckLimitForRarity(card.rarity) : 2;
      const current = next.get(cardId) ?? 0;
      const clamped = Math.max(0, Math.min(limit, current + delta));
      if (clamped === 0) next.delete(cardId);
      else next.set(cardId, clamped);
      return next;
    });
  }

  const pickerCards = useMemo(() => {
    return (collection ?? [])
      .map((entry) => entry.card)
      .filter((card) => !search || card.name.toLowerCase().includes(search.toLowerCase()));
  }, [collection, search]);

  if (!user) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 pt-16 text-center">
        <h1 className="font-display text-2xl font-bold">Конструктор колод</h1>
        <p className="text-sm text-raido-mist">Войди, чтобы собрать колоду из 30 карт.</p>
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
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Колоды</h1>
        <Button onClick={startNewDeck} variant="secondary" className="px-4 py-1.5 text-xs">
          + Новая колода
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {(decks ?? []).map((deck) => (
          <button
            key={deck.id}
            type="button"
            onClick={() => setActiveDeckId(deck.id)}
            className={clsx(
              'rounded-full border px-3 py-1.5 text-xs font-medium',
              activeDeckId === deck.id
                ? 'border-raido-red bg-raido-red/15 text-raido-red'
                : 'border-white/10 text-raido-mist hover:text-raido-white',
            )}
          >
            {deck.name} ({deck.cards.reduce((s, c) => s + c.quantity, 0)}/{DECK_SIZE})
          </button>
        ))}
      </div>

      {activeDeckId ? (
        <div className="grid gap-6 md:grid-cols-[1.1fr_1fr]">
          <div className="flex flex-col gap-4">
            <input
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
              className="min-h-11 rounded-lg border border-white/10 bg-raido-graphite px-3 text-sm font-semibold outline-none focus:border-raido-red"
            />

            <div
              className={clsx(
                'rounded-xl border p-3 text-sm',
                validation.valid && ownershipIssues.length === 0
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                  : 'border-raido-red/40 bg-raido-red/10 text-raido-redGlow',
              )}
            >
              <p className="font-semibold">
                {totalCards}/{DECK_SIZE} карт{' '}
                {validation.valid && ownershipIssues.length === 0
                  ? '· Колода готова'
                  : '· Требует правок'}
              </p>
              <ul className="mt-1 list-inside list-disc text-xs opacity-90">
                {validation.issues.slice(0, 5).map((issue, i) => (
                  <li key={i}>{issue.message}</li>
                ))}
                {ownershipIssues.slice(0, 5).map((msg, i) => (
                  <li key={`own-${i}`}>{msg}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-semibold text-raido-mist">Кривая стоимости</h3>
              <EnergyCurve entries={entriesFromMap(entries)} cardsById={cardsById} />
            </div>

            <div>
              <h3 className="mb-2 text-sm font-semibold text-raido-mist">Синергия тегов</h3>
              <TagSynergy entries={entriesFromMap(entries)} cardsById={cardsById} />
            </div>

            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {entriesFromMap(entries).map((entry) => {
                const card = cardsById.get(entry.cardId);
                if (!card) return null;
                return (
                  <div key={entry.cardId} className="relative">
                    <CardView card={card} size="sm" />
                    <div className="absolute inset-x-0 -bottom-2 flex justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => adjustCard(entry.cardId, -1)}
                        className="flex h-6 w-6 items-center justify-center rounded-full bg-raido-steel text-xs"
                      >
                        −
                      </button>
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-xs font-bold">
                        {entry.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => adjustCard(entry.cardId, 1)}
                        className="flex h-6 w-6 items-center justify-center rounded-full bg-raido-red text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2">
              <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
                {saveMutation.isPending ? 'Сохраняем…' : 'Сохранить колоду'}
              </Button>
              {activeDeckId !== 'new' ? (
                <Button
                  variant="secondary"
                  onClick={() => deleteMutation.mutate(activeDeckId)}
                  disabled={deleteMutation.isPending}
                >
                  Удалить
                </Button>
              ) : null}
            </div>
          </div>

          <div>
            <input
              type="search"
              placeholder="Найти карту в коллекции…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-3 min-h-11 w-full rounded-full border border-white/10 bg-raido-graphite px-4 text-sm outline-none focus:border-raido-red"
            />
            <div className="grid max-h-[70dvh] grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4">
              {pickerCards.map((card) => (
                <button key={card.id} type="button" onClick={() => adjustCard(card.id, 1)}>
                  <CardView card={card} size="sm" />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-raido-mist">
          Выбери существующую колоду выше или создай новую, чтобы начать сборку.
        </p>
      )}
    </div>
  );
}
