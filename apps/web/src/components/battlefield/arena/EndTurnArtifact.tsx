'use client';

import clsx from 'clsx';

export interface EndTurnArtifactProps {
  onClick: () => void;
  disabled: boolean;
  pending: boolean;
  isMyTurn: boolean;
  className?: string;
}

/**
 * The End Turn control as a carved rune-mechanism, not a website pill button (Battlefield
 * Controls Art Pass, desktop only - mobile keeps the exact pre-existing pill look via its own
 * unprefixed classes below, untouched). Positioned by the `.endTurnSlot` slot in
 * MatchBoard.module.css (percentage-anchored to the illustrated asset) - this component never
 * touches that housing's coordinates, it only fills whatever box it's given.
 *
 * Still exactly ONE persistent `<button>` carrying `data-tutorial-target="end-turn"` and the
 * onClick/disabled contract (the tutorial spotlight and the Playwright e2e locator must only ever
 * see one node) - the mobile pill and the desktop circle are the SAME element, distinguished only
 * by `lg:`-prefixed classes, exactly like the pre-existing file. `.endTurnSlot` itself isn't
 * square (15%x17% of the 1672x941 stage) - `lg:aspect-square` with only a height set (no width)
 * is what makes the desktop circle "строго круглый" regardless: the browser derives the width
 * from the height via the aspect ratio, so it can never inherit the housing's own non-square
 * proportions the way the old `rounded-full` (mitred-corner pill) did. The decorative metal
 * ring + rune fixtures around it are a separate, `pointer-events-none`, desktop-only sibling
 * sized with the identical height so the two always line up, never part of the hitbox itself -
 * the button's own circle already covers the entire inner area per spec ("вся внутренняя
 * окружность является корректным button hitbox").
 */
export function EndTurnArtifact({ onClick, disabled, pending, isMyTurn, className }: EndTurnArtifactProps) {
  const ready = isMyTurn && !pending;

  return (
    <div className={clsx('relative flex h-full w-full items-center justify-center', className)}>
      {/* Mobile ambient glow (unchanged). Desktop's own ring-hugging glow lives in the decorative
          layer below instead. */}
      {ready ? (
        <span aria-hidden className="pointer-events-none absolute inset-0 rounded-full blur-md animate-arena-breathe bg-raido-red/25 lg:hidden" />
      ) : null}
      {pending ? (
        <span aria-hidden className="pointer-events-none absolute inset-0 rounded-full blur-md animate-arena-breathe bg-amber-400/20 lg:hidden" />
      ) : null}

      {/* --- Desktop-only decorative mechanism: black-metal + old-gold ring, tick marks (same
          language as HeroFrame's commander medallion), four small runic fixtures at the compass
          points. Sized identically to the button below (`aspect-square h-[78%]`) so it always
          hugs the real circle exactly, whatever `--arena-w` resolves to at the current viewport. */}
      <div aria-hidden className="pointer-events-none absolute hidden aspect-square h-[78%] w-auto lg:block">
        <span
          className={clsx(
            'absolute inset-[6%] rounded-full blur-lg transition-opacity duration-500',
            ready && 'animate-arena-breathe bg-raido-red/45 opacity-100',
            pending && 'animate-arena-breathe bg-amber-400/30 opacity-100',
            !ready && !pending && 'opacity-0',
          )}
        />
        <svg
          viewBox="0 0 100 100"
          className={clsx(
            'absolute inset-0 h-full w-full transition-colors duration-500',
            ready ? 'text-raido-gold/70' : pending ? 'text-amber-400/55' : 'text-raido-gold/25',
          )}
        >
          <circle cx="50" cy="50" r="48" stroke="#0a0a0d" strokeWidth="6" fill="none" />
          <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="1.4" fill="none" />
          <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.8" opacity="0.6" fill="none" />
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i / 24) * 2 * Math.PI;
            const x1 = 50 + Math.cos(angle) * 44.5;
            const y1 = 50 + Math.sin(angle) * 44.5;
            const x2 = 50 + Math.cos(angle) * 48;
            const y2 = 50 + Math.sin(angle) * 48;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1" />;
          })}
        </svg>
        {[0, 90, 180, 270].map((deg) => (
          <span
            key={deg}
            className={clsx(
              'absolute left-1/2 top-1/2 h-[9%] w-[9%] rotate-45 border transition-colors duration-500',
              ready ? 'border-raido-gold/70 bg-raido-graphite' : pending ? 'border-amber-400/60 bg-raido-graphite' : 'border-raido-gold/20 bg-raido-graphite/60',
            )}
            style={{ transform: `translate(-50%, -50%) rotate(${deg}deg) translate(0, -164%) rotate(45deg)` }}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        data-tutorial-target="end-turn"
        className={clsx(
          // Mobile polish (unchanged): the base Button classes' own `px-5 py-2.5 min-h-11 text-sm`
          // were never overridden - inside a housing this small the mobile mechanism is a real
          // ~170px circle, that padding alone left less room for the label than the text needed.
          'relative z-10 flex !h-[62%] !w-[62%] !min-h-0 flex-col items-center justify-center whitespace-normal break-words rounded-full border-2 !p-0.5 text-[7px] font-black uppercase leading-[1.1] tracking-tight shadow-[inset_0_2px_6px_rgba(0,0,0,0.5)] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-raido-black disabled:cursor-not-allowed',
          ready && 'bg-raido-red text-raido-white shadow-glow border-raido-gold/50 focus-visible:ring-raido-red',
          !ready && !pending && 'bg-[#1c1830] border-[#8a6fe0]/30 text-[#c9bdf0]',
          pending && 'bg-amber-900/60 border-amber-400/50 text-amber-50',
          // Desktop override: a true circle (height-only + aspect-square, see file comment above).
          // `lg:!min-w-0` matters as much as `aspect-square` itself: a flex item's default
          // `min-width:auto` floors its width at the *content's* min-content size (here, the
          // unbroken word "ЗАВЕРШИТЬ"), which silently overrode the aspect-ratio-derived width and
          // stretched the circle into the same kind of pill this pass removes - confirmed via
          // computed styles (`aspect-ratio` correctly resolved to `1 / 1`, yet the rendered box was
          // still 87x75px, not 75x75, until this was added).
          'lg:!h-[78%] lg:!w-auto lg:aspect-square lg:!min-w-0 lg:gap-0.5 lg:rounded-full lg:border lg:text-[8.5px] lg:leading-[1.15] lg:tracking-normal lg:[text-shadow:0_1px_3px_rgba(0,0,0,0.8)] lg:focus-visible:ring-raido-gold',
          ready &&
            'lg:!border-raido-red/60 lg:!bg-[radial-gradient(circle_at_50%_38%,rgba(227,18,62,0.55),rgba(40,4,10,0.9)_75%)] lg:!text-raido-white lg:shadow-[inset_0_2px_10px_rgba(0,0,0,0.55),0_0_16px_rgba(227,18,62,0.4)] lg:hover:!border-raido-gold/70',
          pending &&
            'lg:!border-amber-500/50 lg:!bg-[radial-gradient(circle_at_50%_38%,rgba(180,120,20,0.55),rgba(35,20,4,0.9)_75%)] lg:!text-amber-50 lg:shadow-[inset_0_2px_10px_rgba(0,0,0,0.55)]',
          !ready &&
            !pending &&
            'lg:!border-white/10 lg:!bg-[radial-gradient(circle_at_50%_38%,rgba(60,60,72,0.35),rgba(10,10,13,0.92)_75%)] lg:!text-raido-mist lg:shadow-[inset_0_2px_10px_rgba(0,0,0,0.6)]',
        )}
      >
        <span className="lg:hidden">{pending ? 'Обработка…' : 'Завершить ход'}</span>
        {pending ? (
          <span className="hidden lg:block">ОБРАБОТКА…</span>
        ) : (
          <>
            <span className="hidden lg:block">ЗАВЕРШИТЬ</span>
            <span className="hidden lg:block">ХОД</span>
          </>
        )}
      </button>
    </div>
  );
}
