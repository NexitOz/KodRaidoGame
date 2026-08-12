import clsx from 'clsx';

export interface DeckPileProps {
  count: number;
  align?: 'left' | 'right';
  className?: string;
}

/**
 * The deck as a physical layered card-back stack, echoing `CardBack`'s rune-glyph language.
 * Purely presentational over the already-available `deckCount` — no hidden information is
 * exposed, nothing about draw order or contents. Static only in Phase A (no draw-trigger
 * animation yet).
 */
export function DeckPile({ count, align = 'left', className }: DeckPileProps) {
  const stackDepth = count <= 0 ? 0 : count < 8 ? 1 : count < 20 ? 2 : 3;

  return (
    <div className={clsx('relative flex items-center gap-1.5', align === 'right' && 'flex-row-reverse', className)}>
      <div className="relative h-8 w-6" aria-hidden="true">
        {Array.from({ length: stackDepth }).map((_, i) => (
          <span
            key={i}
            className="absolute inset-0 rounded-[3px] border border-raido-gold/25 bg-raido-graphite shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
            style={{ transform: `translate(${i * 1}px, ${-i * 1.5}px)` }}
          />
        ))}
        {count > 0 ? (
          <span className="absolute inset-0 flex items-center justify-center rounded-[3px] border border-raido-gold/40 bg-raido-graphite text-[9px] text-raido-gold/70">
            ᚱ
          </span>
        ) : (
          <span className="absolute inset-0 rounded-[3px] border border-dashed border-white/10" />
        )}
      </div>
      <span className="text-[11px] font-semibold tabular-nums text-raido-mist">{count}</span>
    </div>
  );
}
