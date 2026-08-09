'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { Button } from '@kod-raido/ui';
import { api, ApiError } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await api.login({ email, password });
      setAuth(result.user, result.accessToken);
      router.push('/collection');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось войти.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 pt-10">
      <h1 className="font-display text-2xl font-bold">Вход в Код Райдо</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="min-h-11 rounded-lg border border-white/10 bg-raido-graphite px-3 py-2 text-raido-white outline-none focus:border-raido-red"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          Пароль
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="min-h-11 rounded-lg border border-white/10 bg-raido-graphite px-3 py-2 text-raido-white outline-none focus:border-raido-red"
          />
        </label>
        {error ? <p className="text-sm text-raido-redGlow">{error}</p> : null}
        <Button type="submit" disabled={loading}>
          {loading ? 'Входим…' : 'Войти'}
        </Button>
      </form>
      <p className="text-sm text-raido-mist">
        Нет аккаунта?{' '}
        <Link href="/register" className="text-raido-red hover:underline">
          Зарегистрироваться
        </Link>
      </p>
      <p className="text-xs text-raido-mist/70">
        Демо-аккаунт: <code>demo@kodraido.io</code> / <code>demo12345</code>
      </p>
    </div>
  );
}
