/**
 * Faction visual accents (section 7: Faction Visual Identity). Lives here, not per-app, so
 * CardView and the faction badge share one definition. Purely accent color + motif glyph -
 * factions differ in card frame/badge accent, never a full UI recolor.
 */
export interface FactionAccent {
  /** Tailwind text-color class for the faction's accent (badge label, emblem glyph). */
  textClass: string;
  /** Tailwind border-color class used for a thin accent rule on card frames. */
  borderClass: string;
  /** A single glyph standing in for the faction's motif until real emblem art exists. */
  glyph: string;
  /**
   * Tailwind bg-color class (low opacity) for a static, non-animated ambient tint behind
   * artwork - same hex per faction as textClass/borderClass, just as a background fill instead
   * of text/border, so Art Pack 01's Card Detail "subtle faction ambience" doesn't need its own
   * color source. Static only - no motion, so it needs no Low Data Mode/reduced-motion gating.
   */
  glowClass: string;
}

export const FACTION_ACCENT: Record<string, FactionAccent> = {
  NEUTRAL: {
    textClass: 'text-raido-mist',
    borderClass: 'border-raido-mist/40',
    glyph: '◇',
    glowClass: 'bg-raido-mist/10',
  },
  SHADOW: {
    textClass: 'text-[#c24855]',
    borderClass: 'border-[#8f1f2b]/60',
    glyph: '⟁',
    glowClass: 'bg-[#8f1f2b]/20',
  },
  PURIFICATION: {
    textClass: 'text-[#e7e2d3]',
    borderClass: 'border-[#e7e2d3]/50',
    glyph: '✦',
    glowClass: 'bg-[#e7e2d3]/12',
  },
  BOND: {
    textClass: 'text-[#e0a458]',
    borderClass: 'border-[#e0a458]/50',
    glyph: '❖',
    glowClass: 'bg-[#e0a458]/16',
  },
  VEIL: {
    textClass: 'text-[#9b7ec2]',
    borderClass: 'border-[#5a3d7a]/60',
    glyph: '☾',
    glowClass: 'bg-[#5a3d7a]/24',
  },
  MYSTERY: {
    textClass: 'text-[#9fb4c6]',
    borderClass: 'border-[#7c93a8]/50',
    glyph: '◎',
    glowClass: 'bg-[#7c93a8]/16',
  },
  COSMIC: {
    textClass: 'text-[#6fe2ec]',
    borderClass: 'border-[#4fd6e0]/50',
    glyph: '✵',
    glowClass: 'bg-[#4fd6e0]/14',
  },
};

export function factionAccent(faction: string): FactionAccent {
  return FACTION_ACCENT[faction] ?? FACTION_ACCENT.NEUTRAL!;
}
