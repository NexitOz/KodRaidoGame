import Link from 'next/link';
import { Icon } from '@kod-raido/ui';
import { RaidoLogo } from './RaidoLogo';
import { AuthStatus } from './AuthStatus';

export function TopBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-raido-black/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/">
          <RaidoLogo />
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/settings"
            aria-label="Настройки"
            className="flex h-9 w-9 items-center justify-center rounded-full text-raido-mist transition-colors hover:text-raido-white"
          >
            <Icon name="settings" size={19} />
          </Link>
          <AuthStatus />
        </div>
      </div>
    </header>
  );
}
