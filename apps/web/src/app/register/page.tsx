'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { Button } from '@kod-raido/ui';
import { api, ApiError } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await api.register({ email, username, password });
      setAuth(result.user, result.accessToken);
      router.push('/collection');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось зарегистрироваться.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 pt-10">
      <h1 className="font-display text-2xl font-bold">Присоединиться к Резонансу</h1>
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
          Имя игрока
          <input
            type="text"
            required
            minLength={3}
            maxLength={20}
            pattern="[a-zA-Z0-9_]+"
            title="Только латинские буквы, цифры и подчёркивание"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="min-h-11 rounded-lg border border-white/10 bg-raido-graphite px-3 py-2 text-raido-white outline-none focus:border-raido-red"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          Пароль
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="min-h-11 rounded-lg border border-white/10 bg-raido-graphite px-3 py-2 text-raido-white outline-none focus:border-raido-red"
          />
        </label>
        {error ? <p className="text-sm text-raido-redGlow">{error}</p> : null}
        <Button type="submit" disabled={loading}>
          {loading ? 'Создаём…' : 'Создать аккаунт'}
        </Button>
      </form>
      <p className="text-sm text-raido-mist">
        Уже есть аккаунт?{' '}
        <Link href="/login" className="text-raido-red hover:underline">
          Войти
        </Link>
      </p>
    </div>
  );
}
