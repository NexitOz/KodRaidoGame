'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import clsx from 'clsx';

const ITEMS = [
  { href: '/', label: 'Главная', icon: '⌂' },
  { href: '/play', label: 'Играть', icon: '⚔' },
  { href: '/collection', label: 'Коллекция', icon: '▤' },
  { href: '/decks', label: 'Колоды', icon: '♠' },
  { href: '/resonance', label: 'Пульс', icon: '◈' },
] as const;

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
                className={clsx(
                  'flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium',
                  active ? 'text-raido-red' : 'text-raido-mist',
                )}
              >
                <span aria-hidden className="text-lg">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
