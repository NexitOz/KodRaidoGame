import type { Rarity } from '@kod-raido/shared';

export const RARITY_LABEL: Record<Rarity, string> = {
  COMMON: 'Common',
  RARE: 'Rare',
  EPIC: 'Epic',
  LEGENDARY: 'Legendary',
  RAIDO: 'Raido',
};

export const RARITY_FRAME_CLASS: Record<Rarity, string> = {
  COMMON: 'border-raido-mist/40 shadow-none',
  RARE: 'border-sky-400/60 shadow-[0_0_10px_rgba(56,189,248,0.25)]',
  EPIC: 'border-fuchsia-400/70 shadow-[0_0_14px_rgba(232,121,249,0.3)] animate-shimmer-epic',
  LEGENDARY: 'border-raido-gold shadow-[0_0_18px_rgba(217,180,106,0.45)] animate-pulse-legendary',
  RAIDO: 'border-raido-red shadow-rune animate-pulse-rune',
};
