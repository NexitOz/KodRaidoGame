import clsx from 'clsx';

export interface DeckPileProps {
  count: number;
  align?: 'left' | 'right';
  /** Optional caption above the stack, e.g. "КОЛОДА" - omit for the compact icon+count form. */
  label?: string;
  /** Permanent side identity - only affects the desktop stack's glow/rune tint, matching
   * DiscardPile's own `side` prop. */
  side: 'opponent' | 'player';
  className?: string;
}

function stackDepth(count: number): number {
  if (count <= 0) return 0;
  if (count === 1) return 1;
  if (count < 4) return 2;
  if (count < 10) return 3;
  if (count < 20) return 4;
  return 5;
}

// Per-layer offset step for the back-layer spread (visible depth, not reserved into the front
// card's own box - back layers genuinely extend past its bottom/right edge, like a real pile).
const OFFSET_STEP_PX = 3;

const SIDE_GLOW = {
  opponent: 'radial-gradient(circle at 50% 35%, rgba(227,18,62,0.35), transparent 72%)',
  player: 'radial-gradient(circle at 50% 35%, rgba(90,140,240,0.35), transparent 72%)',
} as const;
const SIDE_RUNE_TEXT = {
  opponent: 'text-raido-red/75',
  player: 'text-[#7fa8f5]/80',
} as const;

/**
 * The deck as a physically real, thick layered stack (Battlefield Controls Art Pass, desktop
 * only - mobile keeps the exact pre-existing compact icon+count markup below, untouched).
 *
 * Sizing is deliberately measured against the real painted housing, not eyeballed: at the
 * shortest supported desktop viewport (1366x650) the live gap between `.plyDeckSlot`'s top and
 * `.plyDiscardSlot`'s top - the tightest of the two sides - is ~134px. Label + front card + the
 * back layers' visible spread beyond it is sized to stay inside that with margin, so it can never
 * paint over the discard housing below it. The counter is a corner badge overlapping the card's
 * own corner (not a separate row) specifically to reclaim enough of that budget for the front card
 * itself to read as large - it's still visually distinct chrome, never obscured by the stack, just
 * no longer competing for vertical rhythm. Max 5 visual layers regardless of `count` - the badge always
 * shows the real number. Only ever draws from the already-available `deckCount` - no card
 * list/draw-order data exists client-side (see `PlayerStateView` in packages/shared), so this is
 * purely a physical stack, never a specific card.
 */
export function DeckPile({ count, align = 'left', label, side, className }: DeckPileProps) {
  const depth = stackDepth(count);
  const cardHeightPx = 100; // ~1.56x the pre-polish desktop card; see the sizing note above.

  return (
    <div className={clsx('flex flex-col items-center gap-1', align === 'right' && 'items-end', className)}>
      {label ? (
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-raido-gold/70 lg:text-[9px] lg:leading-none">{label}</span>
      ) : null}

      {/* --- Mobile (unchanged) --- */}
      <div className={clsx('relative flex flex-col items-center gap-1 lg:hidden', align === 'right' && 'flex-row-reverse')}>
        <div className="relative flex h-12 w-9 items-center justify-center">
          <div className="relative h-9 w-7" aria-hidden="true">
            {Array.from({ length: count <= 0 ? 0 : count < 8 ? 1 : count < 20 ? 2 : 3 }).map((_, i) => (
              <span
                key={i}
                className="absolute inset-0 rounded-[4px] border border-raido-gold/30 bg-gradient-to-b from-raido-graphite to-raido-black shadow-[0_2px_5px_rgba(0,0,0,0.6)]"
                style={{ transform: `translate(${i * 1.5}px, ${-i * 2}px)` }}
              />
            ))}
            {count > 0 ? (
              <span className="absolute inset-0 flex items-center justify-center rounded-[4px] border border-raido-gold/45 bg-gradient-to-b from-raido-graphite to-raido-black text-sm text-raido-gold/75">
                ᚱ
              </span>
            ) : (
              <span className="absolute inset-0 rounded-[4px] border border-dashed border-white/10" />
            )}
          </div>
        </div>
        <span className="text-sm font-bold tabular-nums text-raido-white">{count}</span>
      </div>

      {/* --- Desktop: a real, thick physical stack, sized to the measured housing budget --- */}
      <div className={clsx('relative hidden lg:block', align === 'right' && 'self-end')} aria-hidden="true">
        <div className="relative aspect-[3/4] w-auto min-w-0" style={{ height: `${cardHeightPx}px` }}>
          {depth === 0 ? (
            <span className="absolute inset-0 rounded-md border border-dashed border-white/12 bg-black/20" />
          ) : (
            Array.from({ length: depth }).map((_, i) => {
              const front = i === depth - 1;
              const back = depth - 1 - i; // 0 for the front card, increasing toward the rear
              return (
                <span
                  key={i}
                  className={clsx(
                    'absolute inset-0 rounded-[5px] bg-gradient-to-b',
                    front
                      ? // A thin, continuous forged-gold border all around (not just corner bezels)
                        // plus an inset shadow along the bottom/right to read as a beveled front
                        // face, not a flat rectangle.
                        'border border-[#c9a35f]/75 from-[#252529] to-[#0a0a0c] shadow-[inset_0_-3px_5px_rgba(0,0,0,0.55),inset_-3px_0_5px_rgba(0,0,0,0.55),0_3px_8px_rgba(0,0,0,0.7)]'
                      : // Back layers: a thin bronze seam right at the exposed bottom/right edge
                        // (where this layer peeks out from behind the one in front of it) over a
                        // dark side-edge shadow, so each layer reads as a distinct sheet of card
                        // stock rather than merging into the arena's black background.
                        'border-t border-l border-[#c9a35f]/15 from-[#2a2a30] to-[#0c0c0f] shadow-[inset_0_-1px_0_rgba(201,163,95,0.55),inset_-1px_0_0_rgba(201,163,95,0.55),inset_0_-4px_6px_rgba(0,0,0,0.65),inset_-4px_0_6px_rgba(0,0,0,0.65),0_2px_5px_rgba(0,0,0,0.6)]',
                  )}
                  style={{ transform: `translate(${back * OFFSET_STEP_PX}px, ${back * OFFSET_STEP_PX}px)` }}
                >
                  {front ? (
                    <>
                      {/* Corner bezels - forged metal frame language shared with HeroFrame, layered
                          on top of the continuous border above for extra detail at the corners. */}
                      <span className="absolute left-0 top-0 h-3 w-3 border-l-2 border-t-2 border-[#c9a35f]/60" />
                      <span className="absolute right-0 top-0 h-3 w-3 border-r-2 border-t-2 border-[#c9a35f]/60" />
                      <span className="absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-[#c9a35f]/60" />
                      <span className="absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-[#c9a35f]/60" />
                      <span className="absolute inset-0 rounded-[5px]" style={{ backgroundImage: SIDE_GLOW[side] }} />
                      <span className={clsx('absolute inset-0 flex items-center justify-center font-serif text-4xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]', SIDE_RUNE_TEXT[side])}>
                        ᚱ
                      </span>
                    </>
                  ) : null}
                </span>
              );
            })
          )}
          {/* Counter badge - a distinct corner chip, not a separate row, so the front card can use
              the housing's full vertical budget. Never covered by the stack (highest z, sits at
              the outer corner). */}
          <span className="absolute -bottom-1 -right-1 z-20 flex h-5 min-w-[20px] items-center justify-center rounded-full border border-raido-gold/60 bg-raido-black px-1 text-[10px] font-bold tabular-nums text-raido-white shadow-[0_2px_4px_rgba(0,0,0,0.7)]">
            {count}
          </span>
        </div>
      </div>
    </div>
  );
}
