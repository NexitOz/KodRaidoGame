import clsx from 'clsx';
import { CardBack } from './CardBack';

/** The mechanism badge shows at most this many fanned backs regardless of hand size - the real
 * count always comes from the separate numeric counter, never from counting silhouettes. */
const MAX_FANNED = 3;

export function OpponentHandBacks({ count }: { count: number }) {
  const fanned = Math.min(count, MAX_FANNED);

  return (
    <div role="img" aria-label={`Рука соперника: ${count} карт`}>
      {/* Housed in the illustrated top-right mechanism (see .oppHandBacksSlot, both mobile and
          desktop) - a small fixed-size fan (never more than 3 backs, regardless of real count)
          plus a numeric counter that always shows the real count, including 0, so the indicator
          never just disappears. */}
      <div className="flex flex-col items-center gap-1">
        {/* The painted arena mechanism at this position already reads "РУКА" - a second rendered
            label here would just repeat it. Desktop's own housing/spacing was tuned with this
            label present, so it stays there unchanged; mobile drops it. */}
        <span className="hidden text-[9px] font-bold uppercase tracking-[0.2em] text-raido-red/70 lg:inline">Рука</span>
        <div className="flex items-center gap-1.5">
          <div className="relative flex h-8 w-10 items-center justify-center" aria-hidden="true">
            {Array.from({ length: fanned }, (_, i) => {
              const mid = (fanned - 1) / 2;
              const offset = i - mid;
              return (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    transform: `translateX(${offset * 9}px) rotate(${offset * 10}deg)`,
                    zIndex: i,
                  }}
                >
                  <CardBack size="xs" />
                </div>
              );
            })}
          </div>
          <span
            className={clsx(
              'flex h-5 min-w-[1.25rem] items-center justify-center rounded-full border border-raido-red/50 bg-black/50 px-1 text-xs font-bold tabular-nums text-raido-red',
            )}
          >
            {count}
          </span>
        </div>
      </div>
    </div>
  );
}
