'use client';

import clsx from 'clsx';
import { Button } from '@kod-raido/ui';

export interface EndTurnArtifactProps {
  onClick: () => void;
  disabled: boolean;
  pending: boolean;
  isMyTurn: boolean;
  className?: string;
}

/**
 * The End Turn control reimagined as an arena artifact — the real `Button` (same onClick/disabled/
 * pending semantics, same `data-tutorial-target="end-turn"` hook the tutorial spotlight and the
 * Playwright e2e test rely on) sits inside a decorative rune-ring housing. Idle ring
 * rotation/pulse only when it's actually the player's turn and nothing is pending — no excessive
 * flare, per Phase A scope.
 */
export function EndTurnArtifact({ onClick, disabled, pending, isMyTurn, className }: EndTurnArtifactProps) {
  const ready = isMyTurn && !pending;

  return (
    <div className={clsx('relative flex items-center justify-center', className)}>
      {ready ? (
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-2 rounded-full border border-raido-red/30 animate-spin-slow"
        />
      ) : null}
      {ready ? (
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-1 rounded-full blur-sm animate-arena-breathe bg-raido-red/20"
        />
      ) : null}
      <Button
        onClick={onClick}
        disabled={disabled}
        data-tutorial-target="end-turn"
        className={clsx('relative z-10 min-h-12 w-full text-base', ready && 'shadow-glow')}
      >
        {pending ? 'Обработка…' : 'Завершить ход'}
      </Button>
    </div>
  );
}
