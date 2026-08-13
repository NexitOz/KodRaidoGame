import clsx from 'clsx';
import { CardBack } from './CardBack';

const MAX_VISIBLE = 8;
/** Desktop mechanism badge shows at most this many fanned backs regardless of hand size - the
 * real count always comes from the separate numeric counter, never from counting silhouettes. */
const MAX_FANNED = 3;

export function OpponentHandBacks({ count }: { count: number }) {
  const visible = Math.min(count, MAX_VISIBLE);
  const overflow = count - visible;
  const fanned = Math.min(count, MAX_FANNED);

  return (
    <div role="img" aria-label={`Рука соперника: ${count} карт`}>
      {/* Mobile/base: unchanged from the accepted layout - a loose overlapping fan, hidden at lg. */}
      <div className="flex items-center justify-center lg:hidden">
        <div className="flex" style={{ marginLeft: visible > 1 ? 10 : 0 }}>
          {Array.from({ length: visible }, (_, i) => (
            <div key={i} style={{ marginLeft: i === 0 ? 0 : -10, zIndex: i }} className="relative">
              <CardBack size="sm" />
            </div>
          ))}
        </div>
        {overflow > 0 ? <span className="ml-1 text-[11px] text-raido-mist">+{overflow}</span> : null}
      </div>

      {/* Desktop: housed in the illustrated top-right mechanism (see .oppHandBacksSlot) - a small
          fixed-size fan (never more than 3 backs, regardless of real count) plus a numeric counter
          that always shows the real count, including 0, so the indicator never just disappears. */}
      <div className="hidden lg:flex lg:flex-col lg:items-center lg:gap-1">
        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-raido-red/70">Рука</span>
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
