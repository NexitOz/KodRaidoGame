import type { Rarity } from '@kod-raido/shared';

export const RARITY_LABEL: Record<Rarity, string> = {
  COMMON: 'Common',
  RARE: 'Rare',
  EPIC: 'Epic',
  LEGENDARY: 'Legendary',
  RAIDO: 'Raido',
};

/**
 * Static frame treatment per rarity (border + resting shadow only - no animation here). Keeping
 * animation out of the frame class means the card's own opacity/content is never touched by a
 * pulse loop; see RARITY_GLOW_CLASS below for the animated overlay layer.
 * RAIDO is a distinct signature class, not "Legendary but red": black metallic gradient base,
 * red glow, separate from LEGENDARY's warm gold.
 */
export const RARITY_FRAME_CLASS: Record<Rarity, string> = {
  COMMON: 'border-raido-mist/35 bg-raido-graphite',
  RARE: 'border-sky-400/50 bg-raido-graphite shadow-[0_0_10px_rgba(56,189,248,0.18)]',
  EPIC: 'border-raido-violet/60 bg-raido-graphite shadow-epic',
  LEGENDARY: 'border-raido-gold/80 bg-raido-graphite shadow-legendary',
  RAIDO: 'border-raido-red bg-gradient-to-b from-raido-graphite to-raido-black shadow-raido',
};

/**
 * Animated glow overlay per rarity - rendered as a separate absolutely-positioned, pointer-events
 * none layer on top of the frame so the pulse/shimmer never dims the artwork or ability text
 * underneath it. `null` means the rarity is deliberately static (Common/Rare - "almost no
 * particles" / restrained per the rarity language spec).
 */
export const RARITY_GLOW_CLASS: Record<Rarity, string | null> = {
  COMMON: null,
  RARE: null,
  EPIC: 'shadow-epic animate-shimmer-epic',
  LEGENDARY: 'shadow-legendary animate-pulse-legendary',
  RAIDO: 'shadow-raido animate-rune-idle',
};

/**
 * Rarity "pip row" (1-5 dots, low to high) - a compact, at-a-glance rarity read next to the
 * text label, echoing the reference concept's dot-based rarity presentation. Count only, no new
 * rarity tiers or balance meaning attached to it.
 */
export const RARITY_PIP_COUNT: Record<Rarity, number> = {
  COMMON: 1,
  RARE: 2,
  EPIC: 3,
  LEGENDARY: 4,
  RAIDO: 5,
};

export const RARITY_PIP_CLASS: Record<Rarity, string> = {
  COMMON: 'bg-raido-mist',
  RARE: 'bg-sky-400',
  EPIC: 'bg-raido-violet',
  LEGENDARY: 'bg-raido-gold',
  RAIDO: 'bg-raido-red',
};
