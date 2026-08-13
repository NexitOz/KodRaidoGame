import clsx from 'clsx';

export interface DeckPileProps {
  count: number;
  align?: 'left' | 'right';
  /** Optional caption above the stack, e.g. "КОЛОДА" - omit for the compact icon+count form. */
  label?: string;
  className?: string;
}

/**
 * The deck as a physical layered card-back stack. Both mobile and desktop now sit inside the
 * illustrated housing panel painted into the arena asset (left-edge machinery), so the
 * carved-socket frame this used to draw for itself is gone universally — the art already provides
 * that physical housing, this component only renders the real dynamic bits (the stack + count) on
 * top of it. Purely presentational over the already-available `deckCount` — no hidden information
 * is exposed, nothing about draw order or contents. Static only in Phase A (no draw-trigger
 * animation yet).
 */
export function DeckPile({ count, align = 'left', label, className }: DeckPileProps) {
  const stackDepth = count <= 0 ? 0 : count < 8 ? 1 : count < 20 ? 2 : 3;

  return (
    <div className={clsx('flex flex-col items-center gap-1', align === 'right' && 'items-end', className)}>
      {label ? (
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-raido-gold/70 lg:text-[11px]">{label}</span>
      ) : null}
      {/* Column layout - fits inside a tall narrow illustrated housing panel. */}
      <div className={clsx('relative flex flex-col items-center gap-1', align === 'right' && 'flex-row-reverse')}>
        <div className="relative flex h-12 w-9 items-center justify-center lg:h-16 lg:w-12">
          <div className="relative h-9 w-7 lg:h-12 lg:w-9" aria-hidden="true">
            {Array.from({ length: stackDepth }).map((_, i) => (
              <span
                key={i}
                className="absolute inset-0 rounded-[4px] border border-raido-gold/30 bg-gradient-to-b from-raido-graphite to-raido-black shadow-[0_2px_5px_rgba(0,0,0,0.6)]"
                style={{ transform: `translate(${i * 1.5}px, ${-i * 2}px)` }}
              />
            ))}
            {count > 0 ? (
              <span className="absolute inset-0 flex items-center justify-center rounded-[4px] border border-raido-gold/45 bg-gradient-to-b from-raido-graphite to-raido-black text-sm text-raido-gold/75 lg:text-base">
                ᚱ
              </span>
            ) : (
              <span className="absolute inset-0 rounded-[4px] border border-dashed border-white/10" />
            )}
          </div>
        </div>
        <span className="text-sm font-bold tabular-nums text-raido-white lg:text-sm">{count}</span>
      </div>
    </div>
  );
}
