import clsx from 'clsx';
import type { ResonanceTier } from '@kod-raido/shared';

export interface ResonanceRingProps {
  tier: ResonanceTier;
  /** Plays a one-shot expanding pulse (e.g. on an actual Resonance trigger). */
  pulse?: boolean;
  size?: number;
  className?: string;
}

const TIER_STROKE: Record<ResonanceTier, string> = {
  0: 'rgba(138,138,151,0.5)',
  1: 'rgba(56,189,248,0.6)',
  2: 'rgba(52,211,153,0.6)',
  3: 'rgba(251,191,36,0.65)',
  4: 'rgba(169,120,240,0.7)',
  5: 'rgba(227,18,62,0.85)',
};

/**
 * Concentric-ring waveform motif for the Resonance mechanic - shared by the battlefield
 * centerpiece (ResonancePulse) and the Card Detail cinematic view, so the signature mechanic
 * reads as one consistent visual identity wherever it appears.
 */
export function ResonanceRing({ tier, pulse, size = 96, className }: ResonanceRingProps) {
  const stroke = TIER_STROKE[tier];
  const rings = [0, 1, 2].slice(0, tier === 0 ? 1 : tier >= 4 ? 3 : 2);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={clsx('pointer-events-none', className)}
      aria-hidden
    >
      {rings.map((i) => (
        <circle
          key={i}
          cx="50"
          cy="50"
          r={26 + i * 12}
          fill="none"
          stroke={stroke}
          strokeWidth={tier >= 5 ? 2 : 1.2}
          strokeDasharray={tier >= 3 ? '2 6' : undefined}
          opacity={1 - i * 0.28}
        />
      ))}
      {pulse ? (
        <circle cx="50" cy="50" r="26" fill="none" stroke={stroke} strokeWidth={2} className="animate-ring-expand" />
      ) : null}
      <circle cx="50" cy="50" r="4" fill={stroke} />
    </svg>
  );
}
