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
 * The arena's central medallion. Both mobile (`kod-raido-arena-mobile.webp`) and desktop
 * (`kod-raido-arena-base.webp`) now render this sitting directly on top of the illustrated
 * physical mechanism painted into the arena asset (concentric gold rings, compass/rune geometry,
 * arcane star) — that artwork provides the housing, so this component only renders the *dynamic*
 * portions the art can't: turn-state illumination, the Raido rune, and the real `ResonancePulse`
 * state. No competing CSS rings/housing here (Battlefield Art Asset integration).
 */
export function ArenaCore({ tier, triggerKey, isMyTurn }: ArenaCoreProps) {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      {/* Breathing glow backdrop, warm/cool by whose turn it is. */}
      <div
        aria-hidden
        className={clsx(
          'pointer-events-none absolute inset-0 rounded-full blur-2xl animate-arena-breathe',
          isMyTurn ? 'bg-raido-red/25' : 'bg-[#8a6fe0]/20',
        )}
      />
      <span aria-hidden className="pointer-events-none absolute select-none font-serif text-3xl text-raido-gold/40">
        ᚱ
      </span>

      <ResonancePulse tier={tier} triggerKey={triggerKey} />
    </div>
  );
}
