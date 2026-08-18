import Link from 'next/link';
import clsx from 'clsx';
import { Icon } from '@kod-raido/ui';
import { RaidoLogo } from './RaidoLogo';
import { AuthStatus } from './AuthStatus';

export interface TopBarProps {
  /** Active mobile match viewport (see AppShell) - hidden below `lg` so the match owns the full
   * `100dvh`; unchanged (always visible) at `lg` and up, matching desktop's existing behavior. */
  hiddenOnMobileMatch?: boolean;
}

export function TopBar({ hiddenOnMobileMatch }: TopBarProps = {}) {
  return (
    <header
      className={clsx(
        'sticky top-0 z-30 border-b border-white/5 bg-raido-black/80 backdrop-blur',
        hiddenOnMobileMatch && 'hidden lg:block',
      )}
    >
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-3 sm:px-4">
        <Link href="/" className="min-w-0">
          <RaidoLogo />
        </Link>
        <div className="flex flex-shrink-0 items-center gap-1.5 sm:gap-3">
          <Link
            href="/profile"
            aria-label="Профиль"
            className="flex h-9 w-9 items-center justify-center rounded-full text-raido-mist transition-colors hover:text-raido-white"
          >
            <Icon name="player" size={19} />
          </Link>
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
