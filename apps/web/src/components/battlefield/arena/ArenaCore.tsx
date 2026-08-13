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
 * The arena's central medallion — the single strongest object in the whole composition, anchoring
 * the seam between the two halves. A decorative Rune Raido frame that houses the existing
 * Resonance presentation: an arena artifact first, Resonance display second — it does not redefine
 * or duplicate Resonance mechanics, it only gives `ResonancePulse` a premium home. Idle/turn-state
 * lighting only, no per-node energy travel yet (that's Phase B).
 */
export function ArenaCore({ tier, triggerKey, isMyTurn }: ArenaCoreProps) {
  return (
    <div className="relative flex h-24 w-24 items-center justify-center sm:h-32 sm:w-32 lg:h-40 lg:w-40">
      {/* Breathing glow backdrop, warm/cool by whose turn it is. */}
      <div
        aria-hidden
        className={clsx(
          'pointer-events-none absolute inset-0 rounded-full blur-2xl animate-arena-breathe',
          isMyTurn ? 'bg-raido-red/25' : 'bg-[#8a6fe0]/20',
        )}
      />
      <div aria-hidden className="pointer-events-none absolute inset-4 rounded-full blur-lg bg-raido-gold/10" />

      {/* Outermost engraved ring - large rune ticks, idle rotation. */}
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        className={clsx(
          'pointer-events-none absolute inset-0 h-full w-full animate-spin-slow',
          isMyTurn ? 'text-raido-red/55' : 'text-[#a894f0]/45',
        )}
      >
        <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.55" />
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i / 16) * 2 * Math.PI;
          const x1 = 50 + Math.cos(angle) * 44.5;
          const y1 = 50 + Math.sin(angle) * 44.5;
          const x2 = 50 + Math.cos(angle) * 48;
          const y2 = 50 + Math.sin(angle) * 48;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1.4" />;
        })}
      </svg>

      {/* Second ring - gold, counter-rotating, dashed arcane geometry. */}
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        className="pointer-events-none absolute inset-3 h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)] animate-spin-slow-reverse text-raido-gold/45"
      >
        <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="0.75" fill="none" strokeDasharray="3 6" />
        <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.5" />
      </svg>

      {/* Third ring - fine engraved detail, static, closest to the housing. */}
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        className="pointer-events-none absolute inset-6 h-[calc(100%-3rem)] w-[calc(100%-3rem)] text-raido-gold/25"
      >
        <circle cx="50" cy="50" r="47" stroke="currentColor" strokeWidth="0.5" fill="none" />
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * 2 * Math.PI;
          const x1 = 50 + Math.cos(angle) * 30;
          const y1 = 50 + Math.sin(angle) * 30;
          const x2 = 50 + Math.cos(angle) * 46;
          const y2 = 50 + Math.sin(angle) * 46;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="0.4" />;
        })}
      </svg>

      {/* Engraved medallion housing - a solid dark-metal + brass frame the Resonance ring sits
          inside, with a large watermark Raido rune behind it for scale/presence even before any
          Resonance tier is lit. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-8 rounded-full border-2 border-raido-gold/35 bg-gradient-to-b from-raido-black/70 to-raido-black/90 [box-shadow:inset_0_0_18px_rgba(0,0,0,0.85),inset_0_0_0_1px_rgba(217,180,106,0.15)]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute select-none font-serif text-4xl text-raido-gold/15 sm:text-5xl lg:text-6xl"
      >
        ᚱ
      </span>

      <ResonancePulse tier={tier} triggerKey={triggerKey} />
    </div>
  );
}
