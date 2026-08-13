import clsx from 'clsx';

export interface DeckPileProps {
  count: number;
  align?: 'left' | 'right';
  /** Optional caption above the stack, e.g. "КОЛОДА" - omit for the compact icon+count form. */
  label?: string;
  className?: string;
}

/**
 * The deck as a physical layered card-back stack, echoing `CardBack`'s rune-glyph language.
 * Purely presentational over the already-available `deckCount` — no hidden information is
 * exposed, nothing about draw order or contents. Static only in Phase A (no draw-trigger
 * animation yet).
 */
export function DeckPile({ count, align = 'left', label, className }: DeckPileProps) {
  const stackDepth = count <= 0 ? 0 : count < 8 ? 1 : count < 20 ? 2 : 3;

  return (
    <div className={clsx('flex flex-col gap-1', align === 'right' && 'items-end', className)}>
      {label ? (
        <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-raido-mist">{label}</span>
      ) : null}
      <div className={clsx('relative flex items-center gap-1.5', align === 'right' && 'flex-row-reverse')}>
        <div className="relative h-9 w-7" aria-hidden="true">
          {Array.from({ length: stackDepth }).map((_, i) => (
            <span
              key={i}
              className="absolute inset-0 rounded-[3px] border border-raido-gold/25 bg-raido-graphite shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
              style={{ transform: `translate(${i * 1}px, ${-i * 1.5}px)` }}
            />
          ))}
          {count > 0 ? (
            <span className="absolute inset-0 flex items-center justify-center rounded-[3px] border border-raido-gold/40 bg-raido-graphite text-[10px] text-raido-gold/70">
              ᚱ
            </span>
          ) : (
            <span className="absolute inset-0 rounded-[3px] border border-dashed border-white/10" />
          )}
        </div>
        <span className="text-xs font-semibold tabular-nums text-raido-mist">{count}</span>
      </div>
    </div>
  );
}
