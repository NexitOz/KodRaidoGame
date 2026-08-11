'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import type { Card, CardType, Rarity, ResonanceTier } from '@kod-raido/shared';
import { Button, CardView, RARITY_LABEL, RuneDivider } from '@kod-raido/ui';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';
import { CardDetailDrawer } from '@/components/CardDetailDrawer';
import { FACTION_ORDER, factionLabel } from '@/lib/factions';

const TYPE_FILTERS: Array<{ value: CardType | 'ALL'; label: string }> = [
  { value: 'ALL', label: 'Все' },
  { value: 'CHARACTER', label: 'Персонажи' },
  { value: 'TRACK', label: 'Треки' },
  { value: 'RUNE', label: 'Руны' },
  { value: 'EVENT', label: 'События' },
  { value: 'EDIT', label: 'Эдиты' },
];

const RARITY_FILTERS: Array<{ value: Rarity | 'ALL'; label: string }> = [
  { value: 'ALL', label: 'Все' },
  { value: 'COMMON', label: RARITY_LABEL.COMMON },
  { value: 'RARE', label: RARITY_LABEL.RARE },
  { value: 'EPIC', label: RARITY_LABEL.EPIC },
  { value: 'LEGENDARY', label: RARITY_LABEL.LEGENDARY },
  { value: 'RAIDO', label: RARITY_LABEL.RAIDO },
];

const RESONANCE_FILTERS: Array<{ value: ResonanceTier | 'ALL'; label: string }> = [
  { value: 'ALL', label: 'Все' },
  { value: 0, label: 'T0' },
  { value: 1, label: 'T1' },
  { value: 2, label: 'T2' },
  { value: 3, label: 'T3' },
  { value: 4, label: 'T4' },
  { value: 5, label: 'T5' },
];

function filterButtonClass(active: boolean): string {
  return clsx(
    'min-h-9 rounded-full border px-3 text-xs font-medium transition-all active:scale-95',
    active
      ? 'border-raido-red bg-raido-red/15 text-raido-red'
      : 'border-white/10 text-raido-mist hover:text-raido-white',
  );
}

export default function CollectionPage() {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<CardType | 'ALL'>('ALL');
  const [factionFilter, setFactionFilter] = useState<string>('ALL');
  const [subFactionFilter, setSubFactionFilter] = useState<string>('ALL');
  const [rarityFilter, setRarityFilter] = useState<Rarity | 'ALL'>('ALL');
  const [resonanceFilter, setResonanceFilter] = useState<ResonanceTier | 'ALL'>('ALL');
  const [selected, setSelected] = useState<Card | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['collection', accessToken],
    queryFn: () => api.getCollection(accessToken as string),
    enabled: Boolean(accessToken),
  });

  const factionsPresent = useMemo(() => {
    const present = new Set((data ?? []).map(({ card }) => card.faction));
    return FACTION_ORDER.filter((f) => present.has(f));
  }, [data]);

  const subFactionsForFaction = useMemo(() => {
    if (factionFilter === 'ALL') return [];
    const present = new Set<string>();
    for (const { card } of data ?? []) {
      if (card.faction !== factionFilter) continue;
      for (const sub of card.subFactions) present.add(sub);
    }
    return Array.from(present);
  }, [data, factionFilter]);

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter(({ card }) => {
      if (card.isToken) return false;
      if (typeFilter !== 'ALL' && card.type !== typeFilter) return false;
      if (factionFilter !== 'ALL' && card.faction !== factionFilter) return false;
      if (subFactionFilter !== 'ALL' && !card.subFactions.includes(subFactionFilter)) return false;
      if (rarityFilter !== 'ALL' && card.rarity !== rarityFilter) return false;
      if (resonanceFilter !== 'ALL' && card.resonanceTier !== resonanceFilter) return false;
      if (search && !card.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [data, typeFilter, factionFilter, subFactionFilter, rarityFilter, resonanceFilter, search]);

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

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          {TYPE_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setTypeFilter(f.value)}
              className={filterButtonClass(typeFilter === f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setFactionFilter('ALL');
              setSubFactionFilter('ALL');
            }}
            className={filterButtonClass(factionFilter === 'ALL')}
          >
            Все фракции
          </button>
          {factionsPresent.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => {
                setFactionFilter(f);
                setSubFactionFilter('ALL');
              }}
              className={filterButtonClass(factionFilter === f)}
            >
              {factionLabel(f)}
            </button>
          ))}
        </div>

        {subFactionsForFaction.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSubFactionFilter('ALL')}
              className={filterButtonClass(subFactionFilter === 'ALL')}
            >
              Все дома
            </button>
            {subFactionsForFaction.map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => setSubFactionFilter(sub)}
                className={filterButtonClass(subFactionFilter === sub)}
              >
                {sub}
              </button>
            ))}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2">
          {RARITY_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setRarityFilter(f.value)}
              className={filterButtonClass(rarityFilter === f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] uppercase tracking-wide text-raido-mist">Резонанс:</span>
          {RESONANCE_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setResonanceFilter(f.value)}
              className={filterButtonClass(resonanceFilter === f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <RuneDivider label={isLoading ? undefined : `${filtered.length} карт`} />

      {isLoading ? (
        <p className="text-sm text-raido-mist">Загружаем коллекцию…</p>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-panel border border-dashed border-white/10 py-14 text-center">
          <span aria-hidden className="text-2xl text-raido-mist/40">
            ◈
          </span>
          <p className="text-sm text-raido-mist">Ничего не найдено — попробуй другой фильтр.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filtered.map(({ card, quantity }, i) => (
            <div
              key={card.id}
              className="animate-card-in relative"
              style={{ animationDelay: `${Math.min(i, 24) * 25}ms`, animationFillMode: 'backwards' }}
            >
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
