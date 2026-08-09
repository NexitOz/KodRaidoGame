'use client';

import Link from 'next/link';
import { Button } from '@kod-raido/ui';
import { useAuthStore } from '@/lib/auth-store';
import { api } from '@/lib/api';

export function AuthStatus() {
  const { user, clear } = useAuthStore();

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/login">
          <Button variant="ghost" className="px-3 py-1.5 text-xs">
            Войти
          </Button>
        </Link>
        <Link href="/register">
          <Button variant="primary" className="px-3 py-1.5 text-xs">
            Регистрация
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="hidden text-sm text-raido-mist sm:inline">{user.username}</span>
      <Button
        variant="secondary"
        className="px-3 py-1.5 text-xs"
        onClick={() => {
          api.logout().finally(() => clear());
        }}
      >
        Выйти
      </Button>
    </div>
  );
}
