'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

const VISIBLE_MS = 800;

export function TurnOverlay({ activePlayerId, isMyTurn }: { activePlayerId: string; isMyTurn: boolean }) {
  const prev = useRef(activePlayerId);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (prev.current === activePlayerId) return undefined;
    prev.current = activePlayerId;
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [activePlayerId]);

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center"
      role="status"
      aria-live="polite"
    >
      <span
        className={clsx(
          'animate-turn-banner flex flex-col items-center gap-1.5 rounded-2xl border bg-black/85 px-6 py-3 text-center font-display text-2xl font-bold tracking-widest text-raido-white',
          isMyTurn ? 'border-raido-red/50 shadow-rune' : 'border-white/15 shadow-panel',
        )}
      >
        {isMyTurn ? 'ТВОЙ ХОД' : 'ХОД СОПЕРНИКА'}
        <span
          aria-hidden
          className={clsx('h-px w-16', isMyTurn ? 'bg-raido-red/60' : 'bg-white/20')}
        />
      </span>
    </div>
  );
}
