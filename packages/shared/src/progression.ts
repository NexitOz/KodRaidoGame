const XP_PER_LEVEL = 100;

export function computeLevelForXp(xp: number): number {
  return Math.floor(Math.max(0, xp) / XP_PER_LEVEL) + 1;
}

export const PVE_REWARDS = {
  win: { xp: 50, softCurrency: 100 },
  loss: { xp: 20, softCurrency: 40 },
} as const;
