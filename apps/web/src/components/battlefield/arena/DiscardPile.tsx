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
 * The discard as a physical, dimmed/tilted card-back stack — visually distinct from `DeckPile`
 * (spent/cold vs. ready/warm) using only the already-available `discardCount`. No hidden
 * information exposed.
 */
export function DiscardPile({ count, align = 'left', label, className }: DiscardPileProps) {
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
              className="absolute inset-0 rounded-[3px] border border-white/10 bg-raido-black/70 opacity-80 shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
              style={{ transform: `translate(${i * 1}px, ${-i * 1}px) rotate(${(i - 1) * 3}deg)` }}
            />
          ))}
          {count > 0 ? (
            <span className="absolute inset-0 flex items-center justify-center rounded-[3px] border border-white/15 bg-raido-black/70 text-raido-mist opacity-90">
              <Icon name="skull" size={11} />
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
