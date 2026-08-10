'use client';

import type { ResonanceTier } from '@kod-raido/shared';
import { ResonanceBadge } from '@kod-raido/ui';

export interface ResonancePulseProps {
  tier: ResonanceTier;
  /** Increment to replay the pulse animation (e.g. on a rune trigger). */
  triggerKey: number;
}

/**
 * Compact central Resonance indicator. Not a live "match-wide" score from
 * the backend (no such field exists) — deliberately derived client-side as
 * the highest `resonanceTier` among the viewer's own hand+board cards, using
 * data every card already carries (see docs/progress.md Phase Battlefield
 * 2.0 notes). No balance change: purely a read of existing data.
 */
export function ResonancePulse({ tier, triggerKey }: ResonancePulseProps) {
  return (
    <div className="flex justify-center">
      <span key={triggerKey} className={triggerKey > 0 ? 'animate-resonance-pulse' : ''}>
        <ResonanceBadge tier={tier} />
      </span>
    </div>
  );
}
