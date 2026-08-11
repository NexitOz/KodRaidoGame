'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button, Icon, type IconName } from '@kod-raido/ui';

interface ContinueCard {
  href: string;
  icon: IconName;
  title: string;
  tagline: string;
}

const CONTINUE_CARDS: ContinueCard[] = [
  { href: '/collection', icon: 'collection', title: 'КОЛЛЕКЦИЯ', tagline: 'Посмотри карты, которые у тебя уже есть.' },
  { href: '/decks', icon: 'decks', title: 'КОЛОДЫ', tagline: 'Собери свою колоду для настоящего боя.' },
  { href: '/play', icon: 'play', title: 'ИГРАТЬ', tagline: 'Начни первый настоящий матч.' },
];

export default function TutorialVictoryPage() {
  return (
    <Suspense fallback={null}>
      <TutorialVictoryContent />
    </Suspense>
  );
}

function TutorialVictoryContent() {
  const searchParams = useSearchParams();
  const xp = Number(searchParams.get('xp') ?? 0);
  const currency = Number(searchParams.get('currency') ?? 0);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-6 pt-10 text-center">
      <span className="animate-resonance-pulse text-4xl text-raido-red" aria-hidden="true">
        ◈
      </span>
      <div>
        <h1 className="font-display text-2xl font-bold uppercase tracking-wide">Резонанс услышал тебя</h1>
        <p className="mt-1 text-sm text-raido-mist">Обучение завершено.</p>
      </div>

      {xp > 0 || currency > 0 ? (
        <dl className="grid w-full grid-cols-2 gap-2 text-sm">
          <div className="rounded-lg bg-black/30 p-2">
            <dt className="text-[11px] uppercase tracking-wide text-raido-mist">Опыт</dt>
            <dd className="text-base font-bold">+{xp}</dd>
          </div>
          <div className="rounded-lg bg-black/30 p-2">
            <dt className="text-[11px] uppercase tracking-wide text-raido-mist">Монеты</dt>
            <dd className="text-base font-bold">+{currency}</dd>
          </div>
        </dl>
      ) : null}

      <div className="grid w-full gap-2.5">
        {CONTINUE_CARDS.map((card) => (
          <div
            key={card.href}
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-raido-graphite p-3 text-left"
          >
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-black/40 text-raido-red" aria-hidden="true">
              <Icon name={card.icon} size={18} />
            </span>
            <div>
              <p className="text-sm font-bold text-raido-white">{card.title}</p>
              <p className="text-xs text-raido-mist">{card.tagline}</p>
            </div>
          </div>
        ))}
      </div>

      <Link href="/tutorial/archetypes" className="w-full">
        <Button className="w-full">Продолжить</Button>
      </Link>
    </div>
  );
}
