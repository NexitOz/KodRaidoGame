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
 * Resonance presentation: a large label over 5 clearly visible progression nodes in an engraved
 * frame, echoing the reference's prominent "RESONANCE" band next to each hero - built on the real
 * 0-5 `ResonanceTier` scale (`computeViewerResonanceHeat`), not a fabricated 10-point score. Only
 * ever rendered for the viewer's own side: `PlayerStateView` carries no opponent-resonance signal
 * (it's derived client-side from the viewer's own hand+board, which would leak hidden information
 * if computed for the opponent), so there is deliberately no "enemy resonance meter" anywhere on
 * the board - the opponent's publicly-known state (HP, board, hand count) is shown elsewhere as-is.
 */
export function ResonanceMeter({ tier, triggerKey = 0, align = 'left', className }: ResonanceMeterProps) {
  return (
    <div
      className={clsx(
        'relative flex flex-col items-center gap-1 rounded-xl border-2 border-raido-gold/25 bg-gradient-to-b from-black/50 to-black/30 px-2 py-1.5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.6)] backdrop-blur-sm sm:gap-2 sm:rounded-2xl sm:px-4 sm:py-3 lg:px-5 lg:py-4',
        align === 'right' && 'items-end',
        className,
      )}
    >
      <span aria-hidden className="pointer-events-none absolute inset-1 rounded-xl border border-raido-gold/10" />
      <span className="relative text-[8px] font-bold uppercase tracking-[0.15em] text-raido-gold/80 sm:text-[11px] sm:tracking-[0.25em] lg:text-xs">
        Резонанс
      </span>
      <div className="relative flex items-center gap-1 sm:gap-2 lg:gap-2.5">
        {Array.from({ length: MAX_TIER }).map((_, i) => {
          const lit = i < tier;
          return (
            <span
              key={i}
              aria-hidden
              className={clsx(
                'relative h-2.5 w-2.5 rounded-full ring-2 transition-all duration-300 sm:h-4 sm:w-4 lg:h-5 lg:w-5',
                lit
                  ? 'bg-raido-red ring-raido-redGlow/80 shadow-[0_0_10px_rgba(227,18,62,0.85)]'
                  : 'bg-white/5 ring-white/15',
                lit && triggerKey > 0 && i === tier - 1 && 'animate-resonance-pulse',
              )}
            >
              {lit ? <span aria-hidden className="absolute inset-0.5 rounded-full bg-raido-redGlow/60 blur-[2px]" /> : null}
            </span>
          );
        })}
      </div>
      <span className="relative text-[10px] font-black tabular-nums text-raido-white sm:text-sm lg:text-base">
        {tier}<span className="text-raido-mist">/{MAX_TIER}</span>
      </span>
    </div>
  );
}
