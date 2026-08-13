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
 * The End Turn control as an arena artifact. Mobile keeps the familiar full-width pill inline
 * with the hand controls; desktop (`lg:`) turns the SAME button into a large circular control
 * floating on the right edge of the arena, vertically centered - matching the reference's big
 * right-side End Turn button - purely via responsive classes on one persistent element, so
 * `data-tutorial-target="end-turn"` and the exact onClick/disabled/pending contract never move or
 * duplicate (the tutorial spotlight and the Playwright e2e locator only ever see one node).
 */
export function EndTurnArtifact({ onClick, disabled, pending, isMyTurn, className }: EndTurnArtifactProps) {
  const ready = isMyTurn && !pending;

  return (
    <div
      className={clsx(
        'relative flex items-center justify-center',
        'lg:absolute lg:right-2 lg:top-1/2 lg:z-30 lg:h-28 lg:w-28 lg:-translate-y-1/2',
        className,
      )}
    >
      {ready ? (
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-2 rounded-full border border-raido-red/30 animate-spin-slow lg:-inset-3"
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
        className={clsx(
          'relative z-10 min-h-12 w-full text-base',
          'lg:flex lg:h-full lg:w-full lg:flex-col lg:whitespace-normal lg:rounded-full lg:border-2 lg:border-raido-gold/30 lg:text-sm lg:leading-tight',
          ready && 'shadow-glow',
        )}
      >
        {pending ? 'Обработка…' : 'Завершить ход'}
      </Button>
    </div>
  );
}
