'use client';

import type { ResonanceTier } from '@kod-raido/shared';
import { ResonanceBadge, ResonanceRing } from '@kod-raido/ui';

export interface ResonancePulseProps {
  tier: ResonanceTier;
  /** Increment to replay the pulse animation (e.g. on a rune trigger). */
  triggerKey: number;
}

const TIER_GLOW: Record<ResonanceTier, string> = {
  0: 'bg-raido-mist/[0.06]',
  1: 'bg-sky-400/10',
  2: 'bg-emerald-400/10',
  3: 'bg-amber-400/12',
  4: 'bg-raido-violet/14',
  5: 'bg-raido-red/18',
};

/**
 * Central Resonance centerpiece. Not a live "match-wide" score from the backend (no such field
 * exists) — deliberately derived client-side as the highest `resonanceTier` among the viewer's
 * own hand+board cards, using data every card already carries (see docs/progress.md Phase
 * Battlefield 2.0 notes). No balance change: purely a read of existing data.
 * Battlefield 3.1: sized up and given a permanent (not just on-trigger) ambient glow that scales
 * with tier, so this reads as the arena's living magical/musical centerpiece at rest, not only
 * when it fires - intensity still scales with tier (quiet T0-T2, noticeable T3, layered T4,
 * rare-premium T5), never a screen-blocking banner.
 */
export function ResonancePulse({ tier, triggerKey }: ResonancePulseProps) {
  return (
    <div className="relative flex flex-col items-center justify-center">
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-[-28px] rounded-full blur-2xl ${TIER_GLOW[tier]}`}
      />
      {/* Battlefield 3.3: a small embossed dais beneath the ring - the same rim-lit "carved
          platform" language as the arena's rings/creature sockets - so this reads as the arena's
          grounded energy source rather than a badge floating on transparent background. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-[-6px] rounded-full border border-raido-gold/[0.14]"
        style={{
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -1px 0 rgba(0,0,0,0.3)',
        }}
      />
      <span
        aria-hidden
        className="animate-rune-rotate pointer-events-none absolute inset-[-2px] rounded-full opacity-40"
        style={{ border: '1px dashed rgba(217,180,106,0.3)' }}
      />
      <div className={triggerKey > 0 ? 'animate-resonance-pulse' : ''}>
        <ResonanceRing
          key={triggerKey}
          tier={tier}
          pulse={triggerKey > 0}
          size={tier >= 4 ? 92 : 72}
        />
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
