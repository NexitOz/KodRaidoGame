'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import clsx from 'clsx';
import { Icon, type IconName } from '@kod-raido/ui';

const ITEMS: Array<{ href: string; label: string; icon: IconName }> = [
  { href: '/', label: 'Главная', icon: 'home' },
  { href: '/play', label: 'Играть', icon: 'play' },
  { href: '/collection', label: 'Коллекция', icon: 'collection' },
  { href: '/decks', label: 'Колоды', icon: 'decks' },
  { href: '/resonance', label: 'Пульс', icon: 'resonance' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-white/5 bg-raido-black/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      <ul className="flex items-stretch justify-between">
        {ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={clsx(
                  'relative flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors',
                  active ? 'text-raido-red' : 'text-raido-mist hover:text-raido-white',
                )}
              >
                {active ? (
                  <span aria-hidden className="absolute top-0 h-0.5 w-6 rounded-full bg-raido-red shadow-glow" />
                ) : null}
                <Icon name={item.icon} size={20} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
