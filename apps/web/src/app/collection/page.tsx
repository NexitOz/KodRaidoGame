'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import type { Card, CardType } from '@kod-raido/shared';
import { Button, CardView } from '@kod-raido/ui';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';
import { CardDetailDrawer } from '@/components/CardDetailDrawer';

const TYPE_FILTERS: Array<{ value: CardType | 'ALL'; label: string }> = [
  { value: 'ALL', label: 'Все' },
  { value: 'CHARACTER', label: 'Персонажи' },
  { value: 'TRACK', label: 'Треки' },
  { value: 'RUNE', label: 'Руны' },
  { value: 'EVENT', label: 'События' },
  { value: 'EDIT', label: 'Эдиты' },
];

export default function CollectionPage() {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<CardType | 'ALL'>('ALL');
  const [selected, setSelected] = useState<Card | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['collection', accessToken],
    queryFn: () => api.getCollection(accessToken as string),
    enabled: Boolean(accessToken),
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter(({ card }) => {
      if (typeFilter !== 'ALL' && card.type !== typeFilter) return false;
      if (search && !card.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [data, typeFilter, search]);

  if (!user) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 pt-16 text-center">
        <h1 className="font-display text-2xl font-bold">Коллекция доступна после входа</h1>
        <p className="text-sm text-raido-mist">
          Зарегистрируйся, чтобы получить стартовую коллекцию карт «Код Райдо» и начать собирать
          колоду.
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
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-2xl font-bold">Коллекция</h1>
        <input
          type="search"
          placeholder="Поиск по названию…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-h-11 rounded-full border border-white/10 bg-raido-graphite px-4 text-sm outline-none focus:border-raido-red sm:w-64"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {TYPE_FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setTypeFilter(f.value)}
            className={clsx(
              'min-h-9 rounded-full border px-3 text-xs font-medium transition-colors',
              typeFilter === f.value
                ? 'border-raido-red bg-raido-red/15 text-raido-red'
                : 'border-white/10 text-raido-mist hover:text-raido-white',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-sm text-raido-mist">Загружаем коллекцию…</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-raido-mist">Ничего не найдено.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filtered.map(({ card, quantity }) => (
            <div key={card.id} className="relative">
              <CardView card={card} size="md" onSelect={setSelected} />
              <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-raido-red text-xs font-bold text-white shadow-glow">
                {quantity}
              </span>
            </div>
          ))}
        </div>
      )}

      <CardDetailDrawer card={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
