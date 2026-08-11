'use client';

import Link from 'next/link';
import clsx from 'clsx';
import { Button } from '@kod-raido/ui';
import { STARTER_ARCHETYPES, type StarterArchetypeDifficulty } from '@/lib/starter-archetypes';

const DIFFICULTY_CLASS: Record<StarterArchetypeDifficulty, string> = {
  ПРОСТО: 'border-emerald-400/50 text-emerald-300',
  СРЕДНЕ: 'border-raido-gold/50 text-raido-gold',
  СЛОЖНО: 'border-raido-redGlow/50 text-raido-redGlow',
};

export default function StarterArchetypesPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-5 pt-6">
      <div className="text-center">
        <h1 className="font-display text-xl font-bold">Стартовые колоды</h1>
        <p className="mt-1 text-sm text-raido-mist">
          Шесть готовых архетипов. Не обязательно изучать все сразу — выбери один и начни, остальные
          подождут.
        </p>
      </div>

      <ul className="flex flex-col gap-2.5">
        {STARTER_ARCHETYPES.map((archetype) => (
          <li
            key={archetype.deckName}
            className="flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-raido-graphite p-3"
          >
            <div>
              <p className="text-sm font-bold text-raido-white">{archetype.deckName}</p>
              <p className="mt-0.5 text-xs text-raido-mist">{archetype.tagline}</p>
            </div>
            <span
              className={clsx(
                'shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide',
                DIFFICULTY_CLASS[archetype.difficulty],
              )}
            >
              {archetype.difficulty}
            </span>
          </li>
        ))}
      </ul>

      <Link href="/play">
        <Button className="w-full">Начать бой</Button>
      </Link>
    </div>
  );
}
