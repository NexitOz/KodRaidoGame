import clsx from 'clsx';
import { Icon } from '@kod-raido/ui';

export interface DiscardPileProps {
  count: number;
  align?: 'left' | 'right';
  /** Optional caption above the stack, e.g. "СБРОС" - omit for the compact icon+count form. */
  label?: string;
  className?: string;
}

/**
 * The discard as a physical, dimmed/tilted card-back stack in its own carved socket —
 * visually distinct from `DeckPile` (spent/cold vs. ready/warm) using only the already-available
 * `discardCount`. No hidden information exposed.
 */
export function DiscardPile({ count, align = 'left', label, className }: DiscardPileProps) {
  const stackDepth = count <= 0 ? 0 : count < 8 ? 1 : count < 20 ? 2 : 3;

  return (
    <div className={clsx('flex flex-col items-center gap-1.5', align === 'right' && 'items-end', className)}>
      {label ? (
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-raido-mist lg:text-xs">{label}</span>
      ) : null}
      <div className={clsx('relative flex items-center gap-2', align === 'right' && 'flex-row-reverse')}>
        <div className="relative flex h-12 w-9 items-center justify-center rounded-md border border-white/10 bg-black/50 [box-shadow:inset_0_3px_10px_rgba(0,0,0,0.75)] lg:h-20 lg:w-14">
          <div className="relative h-9 w-7 lg:h-[3.75rem] lg:w-11" aria-hidden="true">
            {Array.from({ length: stackDepth }).map((_, i) => (
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
        <span className="text-sm font-bold tabular-nums text-raido-mist lg:text-base">{count}</span>
      </div>
    </div>
  );
}
