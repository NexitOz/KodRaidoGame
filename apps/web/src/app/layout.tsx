import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { TopBar } from '@/components/TopBar';
import { AppProviders } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Код Райдо: Резонанс',
  description: 'Браузерная коллекционная карточная PvP-игра по вселенной «Код Райдо».',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#07070a',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" className="dark">
      <body>
        <AppProviders>
          <TopBar />
          <main className="mx-auto min-h-[calc(100dvh-3.5rem)] max-w-5xl px-4 pb-20 pt-6 md:pb-10">
            {children}
          </main>
          <BottomNav />
        </AppProviders>
      </body>
    </html>
  );
}
