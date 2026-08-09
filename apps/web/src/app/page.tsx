'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Button, CardView } from '@kod-raido/ui';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';

export default function LandingPage() {
  const user = useAuthStore((s) => s.user);
  const { data: cards } = useQuery({ queryKey: ['cards'], queryFn: api.getCards });

  return (
    <div className="flex flex-col gap-12">
      <section className="flex flex-col items-center gap-5 pt-6 text-center">
        <span className="rounded-full border border-raido-red/40 bg-raido-red/10 px-3 py-1 text-xs uppercase tracking-widest text-raido-red">
          RAIDO: RESONANCE
        </span>
        <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl">
          Музыка. Фандом. <span className="text-raido-red">Резонанс.</span> Бой.
        </h1>
        <p className="max-w-xl text-sm text-raido-mist sm:text-base">
          Собирай колоду из карт вселенной «Код Райдо», следи за реальным хайпом вокруг треков и
          используй Резонанс, чтобы слегка склонить чашу весов в свою пользу — победу всё равно
          решают колода и твои решения.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href={user ? '/collection' : '/register'}>
            <Button variant="primary">Играть</Button>
          </Link>
          <Link href="/resonance">
            <Button variant="secondary">Пульс Райдо</Button>
          </Link>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Актуальные карточки</h2>
          <Link href="/collection" className="text-sm text-raido-red hover:underline">
            Вся коллекция →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {(cards ?? []).slice(0, 8).map((card) => (
            <CardView key={card.id} card={card} size="md" />
          ))}
        </div>
      </section>
    </div>
  );
}
