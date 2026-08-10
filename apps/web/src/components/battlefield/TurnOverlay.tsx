'use client';

import { useEffect, useRef, useState } from 'react';

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
      <span className="animate-turn-banner rounded-2xl border border-raido-red/50 bg-black/85 px-6 py-3 text-center font-display text-2xl font-bold tracking-widest text-raido-white shadow-rune">
        {isMyTurn ? 'ТВОЙ ХОД' : 'ХОД СОПЕРНИКА'}
      </span>
    </div>
  );
}
