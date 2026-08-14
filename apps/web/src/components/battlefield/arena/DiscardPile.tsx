import clsx from 'clsx';
import { Icon } from '@kod-raido/ui';

export interface DiscardPileProps {
  count: number;
  align?: 'left' | 'right';
  /** Optional caption above the stack, e.g. "СБРОС" - omit for the compact icon+count form. */
  label?: string;
  /** Permanent side identity, matching DeckPile - only affects the desktop empty-state sparks and
   * the non-empty stack's faint rim tint. */
  side: 'opponent' | 'player';
  className?: string;
}

const SIDE_SPARK = {
  opponent: 'bg-raido-red/70',
  player: 'bg-[#7fa8f5]/70',
} as const;
const SIDE_RIM = {
  opponent: 'border-raido-red/25',
  player: 'border-[#7fa8f5]/25',
} as const;
const SIDE_GLOW = {
  opponent: 'radial-gradient(circle at 50% 45%, rgba(227,18,62,0.22), transparent 70%)',
  player: 'radial-gradient(circle at 50% 45%, rgba(90,140,240,0.22), transparent 70%)',
} as const;

/**
 * The discard as a recessed, physically real mechanism (Battlefield Controls Art Pass, desktop
 * only - mobile keeps the exact pre-existing compact icon+count markup below, untouched). Empty
 * is a large near-square sunken obsidian/metal plate built into the housing (not a small vertical
 * card floating on top of the panel), with a shattered Raido rune - visually related to
 * `DeckPile` (same corner grammar, same painted-socket family, same corner-badge counter so the
 * two read as one mechanism set) but never identical, matching the discard's own "spent" identity.
 * Sized against the same measured housing budget as `DeckPile` (see that file's sizing note) so
 * neither stack ever paints over the other's socket. Only ever draws from the already-available
 * `discardCount` - no card list/top-card data exists client-side (see `PlayerStateView` in
 * packages/shared), so the non-empty state is a generic layered stack, never a specific real card.
 */
export function DiscardPile({ count, align = 'left', label, side, className }: DiscardPileProps) {
  const empty = count <= 0;
  const depth = empty ? 0 : count === 1 ? 1 : count < 6 ? 2 : 3;
  const platePx = 92;
  const cardHeightPx = 92;

  return (
    <div className={clsx('flex flex-col items-center gap-1', align === 'right' && 'items-end', className)}>
      {label ? (
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-raido-mist lg:text-[9px] lg:leading-none">{label}</span>
      ) : null}

      {/* --- Mobile (unchanged) --- */}
      <div className={clsx('relative flex flex-col items-center gap-1 lg:hidden', align === 'right' && 'flex-row-reverse')}>
        <div className="relative flex h-12 w-9 items-center justify-center">
          <div className="relative h-9 w-7" aria-hidden="true">
            {Array.from({ length: count <= 0 ? 0 : count < 8 ? 1 : count < 20 ? 2 : 3 }).map((_, i) => (
              <span
                key={i}
                className="absolute inset-0 rounded-[4px] border border-white/10 bg-raido-black/80 opacity-80 shadow-[0_2px_5px_rgba(0,0,0,0.6)]"
                style={{ transform: `translate(${i * 1.5}px, ${-i * 1.5}px) rotate(${(i - 1) * 4}deg)` }}
              />
            ))}
            {count > 0 ? (
              <span className="absolute inset-0 flex items-center justify-center rounded-[4px] border border-white/15 bg-raido-black/80 text-raido-mist opacity-90">
                <Icon name="skull" size={16} />
              </span>
            ) : (
              <span className="absolute inset-0 rounded-[4px] border border-dashed border-white/10" />
            )}
          </div>
        </div>
        <span className="text-sm font-bold tabular-nums text-raido-mist">{count}</span>
      </div>

      {/* --- Desktop: a large sunken mechanism built into the housing, cracked when empty --- */}
      <div className={clsx('relative hidden lg:block', align === 'right' && 'self-end')} aria-hidden="true">
        {empty ? (
          <span
            className={clsx(
              'relative flex items-center justify-center overflow-hidden rounded-md border bg-gradient-to-b from-[#0d0d10] to-[#020203] shadow-[inset_0_4px_16px_rgba(0,0,0,0.9)] ring-1 ring-black/50',
              SIDE_RIM[side],
            )}
            style={{ height: `${platePx}px`, width: `${platePx}px` }}
          >
            <span className="absolute inset-0" style={{ backgroundImage: SIDE_GLOW[side] }} />
            {/* Shattered rune: the glyph split into two halves via clip-path, each nudged and
                tilted a couple degrees apart from the other so they read as broken rather than
                merely faded. Sized to the plate's larger, near-square footprint. */}
            <span className="absolute inset-0" style={{ clipPath: 'polygon(0 0, 46% 0, 38% 100%, 0 100%)' }}>
              <span
                className="absolute inset-0 flex items-center justify-center text-4xl text-white/32"
                style={{ fontFamily: 'serif', transform: 'translate(-2px, 0px) rotate(-4deg)' }}
              >
                ᚱ
              </span>
            </span>
            <span className="absolute inset-0" style={{ clipPath: 'polygon(46% 0, 100% 0, 100% 100%, 38% 100%)' }}>
              <span
                className="absolute inset-0 flex items-center justify-center text-4xl text-white/32"
                style={{ fontFamily: 'serif', transform: 'translate(2px, 4px) rotate(3deg)' }}
              >
                ᚱ
              </span>
            </span>
            {/* Fine hairline cracks radiating out from the break, reinforcing "shattered obsidian"
                without turning the surface into a bright web - low, uneven opacity, short runs. */}
            <span className="absolute left-1/2 top-1/2 h-px w-9 bg-white/18" style={{ transform: 'translate(-95%, -55%) rotate(18deg)' }} />
            <span className="absolute left-1/2 top-1/2 h-px w-6 bg-white/15" style={{ transform: 'translate(-15%, -85%) rotate(-38deg)' }} />
            <span className="absolute left-1/2 top-1/2 h-px w-7 bg-white/16" style={{ transform: 'translate(-5%, 15%) rotate(52deg)' }} />
            <span className="absolute left-1/2 top-1/2 h-px w-6 bg-white/14" style={{ transform: 'translate(-85%, 45%) rotate(-10deg)' }} />
            {/* Sparks scattered along the crack line, colored by side. */}
            <span className={clsx('absolute left-[44%] top-[28%] h-[4px] w-[4px] rounded-full blur-[0.5px] animate-arena-breathe', SIDE_SPARK[side])} />
            <span className={clsx('absolute left-[53%] top-[54%] h-[3px] w-[3px] rounded-full blur-[0.5px] animate-arena-breathe', SIDE_SPARK[side])} style={{ animationDelay: '0.6s' }} />
            <span className={clsx('absolute left-[39%] top-[73%] h-[3px] w-[3px] rounded-full blur-[0.5px] animate-arena-breathe', SIDE_SPARK[side])} style={{ animationDelay: '1.1s' }} />
          </span>
        ) : (
          <div className="relative aspect-[3/4] w-auto min-w-0" style={{ height: `${cardHeightPx}px` }}>
            {Array.from({ length: depth }).map((_, i) => {
              const top = i === depth - 1;
              const back = depth - 1 - i;
              return (
                <span
                  key={i}
                  className="absolute inset-0 rounded-md border border-white/12 bg-gradient-to-b from-[#1c1c21] to-[#050506] opacity-90 shadow-[0_3px_7px_rgba(0,0,0,0.7)]"
                  style={{ transform: `translate(${back * 2.5}px, ${-back * 2.5}px) rotate(${(i - (depth - 1) / 2) * 5}deg)` }}
                >
                  {top ? (
                    <span className="flex h-full w-full items-center justify-center text-raido-mist">
                      <Icon name="skull" size={24} />
                    </span>
                  ) : null}
                </span>
              );
            })}
          </div>
        )}
        {/* Counter badge - matches DeckPile's corner-chip language so the two housings read as one
            mechanism family, and so this reclaims the same vertical budget it does there. */}
        <span className="absolute -bottom-1 -right-1 z-20 flex h-5 min-w-[20px] items-center justify-center rounded-full border border-white/25 bg-raido-black px-1 text-[10px] font-bold tabular-nums text-raido-mist shadow-[0_2px_4px_rgba(0,0,0,0.7)]">
          {count}
        </span>
      </div>
    </div>
  );
}
