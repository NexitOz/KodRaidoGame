'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { BottomNav } from './BottomNav';
import { TopBar } from './TopBar';
import { isActiveMatchRoute } from '@/lib/match-route';

/** Route-aware app chrome. Normal pages (including the `/play` lobby) render exactly as before -
 * TopBar, a padded `<main>`, BottomNav. Active match routes (`/play/[matchId]`, `/pvp/[matchId]`,
 * `/tutorial/[matchId]`) additionally get a mobile-only (`<lg`) full-`100dvh` viewport: TopBar and
 * BottomNav are hidden and `<main>` drops its page-chrome padding/min-height so `MatchBoard`'s own
 * `.board` owns the entire screen with no document-level scroll. `lg:` and up is untouched either
 * way - desktop's existing viewport-fit battlefield pass in MatchBoard.module.css is unaffected. */
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isMatch = isActiveMatchRoute(pathname);

  return (
    <>
      <TopBar hiddenOnMobileMatch={isMatch} />
      <main
        className={clsx(
          isMatch
            ? 'h-[100dvh] max-h-[100dvh] w-full overflow-hidden p-0 lg:mx-auto lg:h-auto lg:max-h-none lg:min-h-[calc(100dvh-3.5rem)] lg:w-auto lg:max-w-5xl lg:overflow-visible lg:px-4 lg:pb-10 lg:pt-6'
            : 'mx-auto min-h-[calc(100dvh-3.5rem)] max-w-5xl px-4 pb-20 pt-6 md:pb-10',
        )}
      >
        {children}
      </main>
      <BottomNav hiddenOnMobileMatch={isMatch} />
    </>
  );
}
