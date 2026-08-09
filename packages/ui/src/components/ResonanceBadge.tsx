import type { ResonanceTier } from '@kod-raido/shared';
import clsx from 'clsx';

export interface ResonanceBadgeProps {
  tier: ResonanceTier;
  trending?: boolean;
  className?: string;
}

const TIER_CLASS: Record<ResonanceTier, string> = {
  0: 'text-raido-mist border-raido-mist/30',
  1: 'text-sky-300 border-sky-400/40',
  2: 'text-emerald-300 border-emerald-400/40',
  3: 'text-amber-300 border-amber-400/40',
  4: 'text-fuchsia-300 border-fuchsia-400/40',
  5: 'text-raido-red border-raido-red animate-pulse-rune',
};

export function ResonanceBadge({ tier, trending, className }: ResonanceBadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full border bg-black/50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider backdrop-blur',
        TIER_CLASS[tier],
        className,
      )}
      title={`Resonance Tier ${tier}`}
    >
      <span aria-hidden>◈</span>
      Tier {tier}
      {trending ? <span className="ml-1 text-raido-redGlow">Trending</span> : null}
    </span>
  );
}
