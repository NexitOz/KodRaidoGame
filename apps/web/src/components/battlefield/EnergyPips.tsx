'use client';

import clsx from 'clsx';

const MAX_PIPS = 10;

export interface EnergyPipsProps {
  energy: number;
  maxEnergy: number;
  className?: string;
}

/**
 * Three pip states so "available" and "already spent this turn" both read
 * instantly, not just "how much total": filled = spendable now, dim outline
 * = unlocked but already spent, near-invisible outline = not unlocked yet
 * (energy curve is 1→10 across the match).
 */
export function EnergyPips({ energy, maxEnergy, className }: EnergyPipsProps) {
  const pips = Array.from({ length: MAX_PIPS }, (_, i) => i);
  return (
    <div
      className={clsx('flex flex-wrap items-center justify-center gap-0.5 lg:flex-nowrap', className)}
      role="img"
      aria-label={`Энергия: ${energy} из ${maxEnergy} доступно`}
    >
      {pips.map((i) => {
        const unlocked = i < maxEnergy;
        const available = i < energy;
        return (
          <span
            key={i}
            aria-hidden="true"
            className={clsx(
              'text-[8px] leading-none transition-all duration-300 lg:text-[13px]',
              !unlocked && 'text-white/10',
              unlocked && !available && 'text-raido-red/30',
              unlocked && available && 'text-raido-redGlow drop-shadow-[0_0_4px_rgba(255,45,85,0.75)]',
            )}
          >
            {available && unlocked ? '◆' : '◇'}
          </span>
        );
      })}
    </div>
  );
}
