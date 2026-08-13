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
 * The arena's central medallion. On desktop this now sits directly on top of the illustrated
 * physical mechanism painted into `kod-raido-arena-base.webp` (concentric gold rings, compass/rune
 * geometry, arcane star) — that artwork provides the housing, so this component only renders the
 * *dynamic* portions the art can't: turn-state illumination, the Raido rune, and the real
 * `ResonancePulse` state. No competing CSS rings/housing here (Battlefield Art Asset integration) -
 * on mobile, where the illustrated mechanism isn't used, the soft glow still reads as a plausible
 * ambient light source on its own.
 */
export function ArenaCore({ tier, triggerKey, isMyTurn }: ArenaCoreProps) {
  return (
    <div className="relative flex h-24 w-24 items-center justify-center sm:h-32 sm:w-32 lg:h-full lg:w-full">
      {/* Breathing glow backdrop, warm/cool by whose turn it is. */}
      <div
        aria-hidden
        className={clsx(
          'pointer-events-none absolute inset-0 rounded-full blur-2xl animate-arena-breathe',
          isMyTurn ? 'bg-raido-red/25' : 'bg-[#8a6fe0]/20',
        )}
      />
      <div aria-hidden className="pointer-events-none absolute inset-4 rounded-full blur-lg bg-raido-gold/10 lg:hidden" />

      {/* Idle-rotating rune ring - kept as the one dynamic motion cue; hidden on desktop where the
          illustrated mechanism's own engraved rings already read as static "premium artifact"
          detail and a spinning CSS ring on top would compete with it. */}
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        className={clsx(
          'pointer-events-none absolute inset-0 h-full w-full animate-spin-slow lg:hidden',
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

      {/* Mobile-only engraved medallion housing - desktop gets this from the illustrated asset. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-8 rounded-full border-2 border-raido-gold/35 bg-gradient-to-b from-raido-black/70 to-raido-black/90 [box-shadow:inset_0_0_18px_rgba(0,0,0,0.85),inset_0_0_0_1px_rgba(217,180,106,0.15)] lg:hidden"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute select-none font-serif text-4xl text-raido-gold/15 sm:text-5xl lg:text-3xl lg:text-raido-gold/40"
      >
        ᚱ
      </span>

      <ResonancePulse tier={tier} triggerKey={triggerKey} />
    </div>
  );
}
