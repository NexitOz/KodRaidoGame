'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Button, CardView, RuneDivider } from '@kod-raido/ui';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';

export default function LandingPage() {
  const user = useAuthStore((s) => s.user);
  const { data: cards } = useQuery({ queryKey: ['cards'], queryFn: api.getCards });

  return (
    <div className="flex flex-col gap-12">
      <section className="relative flex flex-col items-center gap-5 overflow-hidden rounded-3xl border border-white/5 bg-raido-radial px-4 pb-10 pt-8 text-center">
        <span aria-hidden className="bg-noise-layer pointer-events-none absolute inset-0 bg-rune-noise opacity-40" />
        <span className="relative rounded-full border border-raido-red/40 bg-raido-red/10 px-3 py-1 text-xs uppercase tracking-widest text-raido-red">
          Код Райдо: Резонанс
        </span>
        <h1 className="relative font-display text-4xl font-bold leading-tight sm:text-5xl">
          Музыка рождает <span className="text-raido-red">Резонанс</span>.
          <br />
          Резонанс меняет карты.
        </h1>
        <p className="relative max-w-xl text-sm text-raido-mist sm:text-base">
          Собирай колоду из карт вселенной «Код Райдо», следи за реальным хайпом вокруг треков и
          используй Резонанс, чтобы слегка склонить чашу весов в свою пользу — победу всё равно
          решают колода и твои решения.
        </p>
        <div className="relative flex flex-wrap items-center justify-center gap-3">
          <Link href={user ? '/play' : '/register'}>
            <Button variant="primary">Играть</Button>
          </Link>
          <Link href="/collection">
            <Button variant="secondary">Коллекция</Button>
          </Link>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Актуальные карточки</h2>
          <Link href="/resonance" className="text-sm text-raido-red hover:underline">
            Пульс Райдо →
          </Link>
        </div>
        <RuneDivider className="mb-4" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {(cards ?? []).slice(0, 8).map((card, i) => (
            <div key={card.id} className="animate-card-in" style={{ animationDelay: `${i * 30}ms`, animationFillMode: 'backwards' }}>
              <CardView card={card} size="md" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
