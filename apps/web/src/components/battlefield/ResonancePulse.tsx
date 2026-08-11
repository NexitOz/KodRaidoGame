'use client';

import type { ResonanceTier } from '@kod-raido/shared';
import { ResonanceBadge, ResonanceRing } from '@kod-raido/ui';

export interface ResonancePulseProps {
  tier: ResonanceTier;
  /** Increment to replay the pulse animation (e.g. on a rune trigger). */
  triggerKey: number;
}

/**
 * Central Resonance centerpiece. Not a live "match-wide" score from the backend (no such field
 * exists) — deliberately derived client-side as the highest `resonanceTier` among the viewer's
 * own hand+board cards, using data every card already carries (see docs/progress.md Phase
 * Battlefield 2.0 notes). No balance change: purely a read of existing data.
 * Intensity scales with tier (quiet T0-T2, noticeable T3, layered T4, rare-premium T5) but stays
 * a small ring + badge, never a screen-blocking banner - see section 18 of visual-polish-01.
 */
export function ResonancePulse({ tier, triggerKey }: ResonancePulseProps) {
  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className={triggerKey > 0 ? 'animate-resonance-pulse' : ''}>
        <ResonanceRing key={triggerKey} tier={tier} pulse={triggerKey > 0} size={tier >= 4 ? 72 : 56} />
      </div>
      <div className="-mt-2">
        <ResonanceBadge tier={tier} />
      </div>
      {triggerKey > 0 ? (
        <span
          key={`label-${triggerKey}`}
          className="animate-float-up absolute -top-3 whitespace-nowrap text-[10px] font-bold uppercase tracking-widest text-raido-red"
          role="status"
        >
          Резонанс {tier}
        </span>
      ) : null}
    </div>
  );
}
