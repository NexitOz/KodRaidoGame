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
  /** Very low-opacity background tint (card-frame footer wash, ambient glows) - keeps the accent
   * restrained (never a full recolor), just enough to read "this card belongs to X". */
  bgSoftClass: string;
}

export const FACTION_ACCENT: Record<string, FactionAccent> = {
  NEUTRAL: {
    textClass: 'text-raido-mist',
    borderClass: 'border-raido-mist/40',
    glyph: '◇',
    bgSoftClass: 'bg-raido-mist/10',
  },
  SHADOW: {
    textClass: 'text-[#c24855]',
    borderClass: 'border-[#8f1f2b]/60',
    glyph: '⟁',
    bgSoftClass: 'bg-[#8f1f2b]/14',
  },
  PURIFICATION: {
    textClass: 'text-[#e7e2d3]',
    borderClass: 'border-[#e7e2d3]/50',
    glyph: '✦',
    bgSoftClass: 'bg-[#e7e2d3]/10',
  },
  BOND: {
    textClass: 'text-[#e0a458]',
    borderClass: 'border-[#e0a458]/50',
    glyph: '❖',
    bgSoftClass: 'bg-[#e0a458]/12',
  },
  VEIL: {
    textClass: 'text-[#9b7ec2]',
    borderClass: 'border-[#5a3d7a]/60',
    glyph: '☾',
    bgSoftClass: 'bg-[#5a3d7a]/16',
  },
  MYSTERY: {
    textClass: 'text-[#9fb4c6]',
    borderClass: 'border-[#7c93a8]/50',
    glyph: '◎',
    bgSoftClass: 'bg-[#7c93a8]/12',
  },
  COSMIC: {
    textClass: 'text-[#6fe2ec]',
    borderClass: 'border-[#4fd6e0]/50',
    glyph: '✵',
    bgSoftClass: 'bg-[#4fd6e0]/12',
  },
};

export function factionAccent(faction: string): FactionAccent {
  return FACTION_ACCENT[faction] ?? FACTION_ACCENT.NEUTRAL!;
}
