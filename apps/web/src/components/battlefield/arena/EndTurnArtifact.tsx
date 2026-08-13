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
 * The End Turn control as an arena mechanism, not a floating website button. Both mobile
 * (`kod-raido-arena-mobile.webp`) and desktop (`kod-raido-arena-base.webp`) anchor the SAME button
 * over the illustrated circular machinery painted into the arena asset — that artwork is the
 * housing now, so the CSS rings/housing this used to draw for itself are gone; only the dynamic
 * illuminated core (state-dependent glow/color) remains, sized to sit inside the painted ring
 * rather than compete with it. Positioned by the `.endTurnSlot` slot in MatchBoard.module.css
 * (percentage-anchored to the illustrated asset), not by this component. Purely via classes on one
 * persistent element, so `data-tutorial-target="end-turn"` and the exact onClick/disabled/pending
 * contract never move or duplicate (the tutorial spotlight and the Playwright e2e locator only
 * ever see one node). Restrained state color: crimson/gold when it's the player's turn and ready,
 * dim violet while waiting on the opponent, amber while a request is pending.
 */
export function EndTurnArtifact({ onClick, disabled, pending, isMyTurn, className }: EndTurnArtifactProps) {
  const ready = isMyTurn && !pending;

  return (
    <div className={clsx('relative flex h-full w-full items-center justify-center', className)}>
      {ready ? (
        <span aria-hidden className="pointer-events-none absolute inset-0 rounded-full blur-md animate-arena-breathe bg-raido-red/25" />
      ) : null}
      {pending ? <span aria-hidden className="pointer-events-none absolute inset-0 rounded-full blur-md animate-arena-breathe bg-amber-400/20" /> : null}

      <Button
        onClick={onClick}
        disabled={disabled}
        data-tutorial-target="end-turn"
        className={clsx(
          // Mobile polish: the base Button classes' own `px-5 py-2.5 min-h-11 text-sm` were never
          // overridden - inside a housing this small (the mobile mechanism is a real ~170px
          // circle, smaller than the desktop one), that padding alone left less room for the
          // label than the text needed, pushing "ЗАВЕРШИТЬ" past both the painted ring and, at
          // the narrowest viewports, the screen edge. Below `lg:` only - desktop keeps its exact
          // accepted sizing (h/w-78%, the unmodified Button padding, 11px text).
          'relative z-10 flex !h-[62%] !w-[62%] !min-h-0 flex-col items-center justify-center whitespace-normal break-words rounded-full border-2 !p-0.5 text-[7px] font-black uppercase leading-[1.1] tracking-tight shadow-[inset_0_2px_6px_rgba(0,0,0,0.5)]',
          'lg:!h-[78%] lg:!w-[78%] lg:!px-5 lg:!py-2.5 lg:text-[11px] lg:leading-tight lg:tracking-wide',
          ready && 'shadow-glow border-raido-gold/50',
          !ready && !pending && '!bg-[#1c1830] border-[#8a6fe0]/30 !text-[#c9bdf0]',
          // Pending is still disabled (blocks double-submits), but the base disabled:opacity-40
          // was washing "Обработка…" out against the amber housing - this state means "actively
          // processing", not "inactive", so it keeps more of its natural contrast than a plain
          // disabled button would.
          pending && '!bg-amber-900/60 border-amber-400/50 !text-amber-50 disabled:!opacity-80',
        )}
      >
        {pending ? 'Обработка…' : 'Завершить ход'}
      </Button>
    </div>
  );
}
