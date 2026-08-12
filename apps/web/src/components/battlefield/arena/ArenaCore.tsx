'use client';

import clsx from 'clsx';
import type { ResonanceTier } from '@kod-raido/shared';
import { ResonancePulse } from '../ResonancePulse';

export interface ArenaCoreProps {
  tier: ResonanceTier;
  triggerKey: number;
  isMyTurn: boolean;
}

/**
 * The arena's central medallion — a decorative Rune Raido frame that houses the existing
 * Resonance presentation. This is an arena artifact first, Resonance display second: it does not
 * redefine or duplicate Resonance mechanics, it only gives `ResonancePulse` a premium home at the
 * board's center seam (Battlefield Visual Foundation, Phase A — idle/turn-state only, no
 * per-node energy travel yet).
 */
export function ArenaCore({ tier, triggerKey, isMyTurn }: ArenaCoreProps) {
  return (
    <div className="relative flex h-24 w-24 items-center justify-center">
      {/* Breathing glow backdrop, warm/cool by whose turn it is. */}
      <div
        aria-hidden
        className={clsx(
          'pointer-events-none absolute inset-0 rounded-full blur-md animate-arena-breathe',
          isMyTurn ? 'bg-raido-red/20' : 'bg-raido-mist/15',
        )}
      />

      {/* Outer idle-rotating ring - engraved rune ticks, very slow so it reads as "alive"
          machinery rather than a spinner. */}
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        className={clsx(
          'pointer-events-none absolute inset-0 h-full w-full animate-spin-slow',
          isMyTurn ? 'text-raido-red/45' : 'text-raido-mist/35',
        )}
      >
        <circle cx="50" cy="50" r="47" stroke="currentColor" strokeWidth="0.75" fill="none" opacity="0.5" />
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * 2 * Math.PI;
          const x1 = 50 + Math.cos(angle) * 44;
          const y1 = 50 + Math.sin(angle) * 44;
          const x2 = 50 + Math.cos(angle) * 47.5;
          const y2 = 50 + Math.sin(angle) * 47.5;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1" />;
        })}
      </svg>

      {/* Inner counter-rotating ring, thinner and quieter. */}
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        className="pointer-events-none absolute inset-2 h-[calc(100%-1rem)] w-[calc(100%-1rem)] animate-spin-slow-reverse text-raido-gold/30"
      >
        <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="0.5" fill="none" strokeDasharray="2 5" />
      </svg>

      {/* Engraved medallion housing - a solid frame the Resonance ring sits inside. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-3 rounded-full border border-raido-gold/20 bg-raido-black/40 [box-shadow:inset_0_0_10px_rgba(0,0,0,0.7)]"
      />

      <ResonancePulse tier={tier} triggerKey={triggerKey} />
    </div>
  );
}
