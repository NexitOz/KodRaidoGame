import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { AppShell } from '@/components/AppShell';
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
          <AppShell>{children}</AppShell>
        </AppProviders>
      </body>
    </html>
  );
}
