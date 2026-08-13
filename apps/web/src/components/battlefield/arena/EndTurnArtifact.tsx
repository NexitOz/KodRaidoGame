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
 * The End Turn control as an arena mechanism, not a floating website button. Mobile keeps the
 * familiar full-width pill inline with the hand controls. Desktop (`lg:`) anchors the SAME button
 * over the illustrated circular machinery painted into `kod-raido-arena-base.webp` on the arena's
 * right edge — that artwork is the housing now, so the CSS rings/housing this used to draw for
 * itself are gone; only the dynamic illuminated core (state-dependent glow/color) remains, sized
 * to sit inside the painted ring rather than compete with it. Positioned by the `.endTurn` slot in
 * MatchBoard.module.css (percentage-anchored to the illustrated asset), not by this component.
 * Purely via responsive classes on one persistent element, so `data-tutorial-target="end-turn"`
 * and the exact onClick/disabled/pending contract never move or duplicate (the tutorial spotlight
 * and the Playwright e2e locator only ever see one node). Restrained state color: crimson/gold
 * when it's the player's turn and ready, dim violet while waiting on the opponent, amber while a
 * request is pending.
 */
export function EndTurnArtifact({ onClick, disabled, pending, isMyTurn, className }: EndTurnArtifactProps) {
  const ready = isMyTurn && !pending;

  return (
    <div className={clsx('relative flex items-center justify-center lg:h-full lg:w-full', className)}>
      {ready ? (
        <span aria-hidden className="pointer-events-none absolute -inset-2 rounded-full border border-raido-red/30 animate-spin-slow lg:hidden" />
      ) : null}
      {ready ? (
        <span aria-hidden className="pointer-events-none absolute inset-0 rounded-full blur-md animate-arena-breathe bg-raido-red/25" />
      ) : null}
      {pending ? <span aria-hidden className="pointer-events-none absolute inset-0 rounded-full blur-md animate-arena-breathe bg-amber-400/20" /> : null}

      <Button
        onClick={onClick}
        disabled={disabled}
        data-tutorial-target="end-turn"
        className={clsx(
          'relative z-10 min-h-12 w-full text-base',
          'lg:flex lg:h-[78%] lg:w-[78%] lg:flex-col lg:whitespace-normal lg:rounded-full lg:border-2 lg:text-[11px] lg:font-black lg:uppercase lg:leading-tight lg:tracking-wide lg:shadow-[inset_0_2px_6px_rgba(0,0,0,0.5)]',
          ready && 'shadow-glow lg:border-raido-gold/50',
          !ready && !pending && 'lg:!bg-[#1c1830] lg:border-[#8a6fe0]/30 lg:!text-[#c9bdf0]',
          pending && 'lg:!bg-amber-900/40 lg:border-amber-400/40',
        )}
      >
        {pending ? 'Обработка…' : 'Завершить ход'}
      </Button>
    </div>
  );
}
