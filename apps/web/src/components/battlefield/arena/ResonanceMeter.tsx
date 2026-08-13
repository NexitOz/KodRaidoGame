import clsx from 'clsx';
import type { ResonanceTier } from '@kod-raido/shared';

export interface ResonanceMeterProps {
  tier: ResonanceTier;
  triggerKey?: number;
  align?: 'left' | 'right';
  className?: string;
}

const MAX_TIER: ResonanceTier = 5;

/**
 * Horizontal Resonance pip row + fraction, echoing the reference's "RESONANCE x/10" band next to
 * each hero - built on the real 0-5 `ResonanceTier` scale (`computeViewerResonanceHeat`), not a
 * fabricated 10-point score. Only ever rendered for the viewer's own side: `PlayerStateView`
 * carries no opponent-resonance signal (it's derived client-side from the viewer's own hand+board,
 * which would leak hidden information if computed for the opponent), so there is deliberately no
 * "enemy resonance meter" anywhere on the board.
 */
export function ResonanceMeter({ tier, triggerKey = 0, align = 'left', className }: ResonanceMeterProps) {
  return (
    <div
      className={clsx(
        'flex flex-col items-center gap-1 rounded-2xl border border-raido-gold/15 bg-black/30 px-3 py-2 backdrop-blur-sm',
        align === 'right' && 'items-end',
        className,
      )}
    >
      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-raido-mist">Резонанс</span>
      <div className={clsx('flex items-center gap-2', align === 'right' && 'flex-row-reverse')}>
        <div className="flex items-center gap-1">
          {Array.from({ length: MAX_TIER }).map((_, i) => {
            const lit = i < tier;
            return (
              <span
                key={i}
                aria-hidden
                className={clsx(
                  'h-2.5 w-2.5 rounded-full ring-1 transition-all duration-300',
                  lit
                    ? 'bg-raido-red ring-raido-redGlow/70 shadow-[0_0_6px_rgba(227,18,62,0.75)]'
                    : 'bg-white/5 ring-white/10',
                  lit && triggerKey > 0 && i === tier - 1 && 'animate-resonance-pulse',
                )}
              />
            );
          })}
        </div>
        <span className="text-xs font-bold tabular-nums text-raido-white">
          {tier}/{MAX_TIER}
        </span>
      </div>
    </div>
  );
}
