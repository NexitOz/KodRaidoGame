import clsx from 'clsx';
import { factionAccent } from '@kod-raido/ui';

export interface FactionAmbienceProps {
  faction: string;
  className?: string;
}

/**
 * Static per-slot faction ambient tint for an occupied `CreatureSlot`, derived from the unit's own
 * `card.faction` via the single canonical `factionAccent()` source — there is no player/team-level
 * faction field on `PlayerStateView`, so ambience is scoped to individual occupied slots only, and
 * empty slots stay neutral. Phase A is static/idle only: a quiet base-color wash, no particles, no
 * triggered combat VFX yet.
 */
export function FactionAmbience({ faction, className }: FactionAmbienceProps) {
  const accent = factionAccent(faction);
  return (
    <span
      aria-hidden
      className={clsx('pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-screen', accent.textClass, className)}
      style={{ backgroundImage: 'radial-gradient(circle at 50% 30%, currentColor, transparent 70%)' }}
    />
  );
}
