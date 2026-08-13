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
 * familiar full-width pill inline with the hand controls; desktop (`lg:`) turns the SAME button
 * into a large circular control - engraved dark-metal housing, concentric rings, an illuminated
 * core - floating on the right edge of the arena, vertically centered, matching the reference's
 * big right-side control. Purely via responsive classes on one persistent element, so
 * `data-tutorial-target="end-turn"` and the exact onClick/disabled/pending contract never move or
 * duplicate (the tutorial spotlight and the Playwright e2e locator only ever see one node).
 * Restrained state color: crimson/gold when it's the player's turn and ready, dim violet while
 * waiting on the opponent, amber while a request is pending.
 */
export function EndTurnArtifact({ onClick, disabled, pending, isMyTurn, className }: EndTurnArtifactProps) {
  const ready = isMyTurn && !pending;
  const ringColor = pending ? 'text-amber-400/60' : ready ? 'text-raido-red/60' : 'text-[#8a6fe0]/35';

  return (
    <div
      className={clsx(
        'relative flex items-center justify-center',
        'lg:absolute lg:right-3 lg:top-1/2 lg:z-30 lg:h-32 lg:w-32 lg:-translate-y-1/2',
        className,
      )}
    >
      {/* Engraved dark-metal housing behind the button - always present, desktop only. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden rounded-full border border-raido-gold/25 bg-gradient-to-b from-raido-graphite to-raido-black lg:block [box-shadow:inset_0_0_16px_rgba(0,0,0,0.8),0_4px_18px_rgba(0,0,0,0.6)]"
      />

      {/* Outer idle-rotating ring - color reflects turn state, always visible on desktop. */}
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        className={clsx('pointer-events-none absolute inset-[-6px] hidden h-[calc(100%+12px)] w-[calc(100%+12px)] lg:block', ringColor, ready && 'animate-spin-slow')}
      >
        <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="1.2" fill="none" />
        {Array.from({ length: 14 }).map((_, i) => {
          const angle = (i / 14) * 2 * Math.PI;
          const x1 = 50 + Math.cos(angle) * 45;
          const y1 = 50 + Math.sin(angle) * 45;
          const x2 = 50 + Math.cos(angle) * 48;
          const y2 = 50 + Math.sin(angle) * 48;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1" />;
        })}
      </svg>
      {/* Inner gold ring, static, engraved detail. */}
      <svg aria-hidden viewBox="0 0 100 100" className="pointer-events-none absolute inset-3 hidden h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)] text-raido-gold/30 lg:block">
        <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="0.6" fill="none" strokeDasharray="2 5" />
      </svg>

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
          'lg:flex lg:h-[calc(100%-1.75rem)] lg:w-[calc(100%-1.75rem)] lg:flex-col lg:whitespace-normal lg:rounded-full lg:border-2 lg:text-sm lg:font-black lg:uppercase lg:leading-tight lg:tracking-wide lg:shadow-[inset_0_2px_6px_rgba(0,0,0,0.5)]',
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
