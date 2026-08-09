const XP_PER_LEVEL = 100;

export function computeLevelForXp(xp: number): number {
  return Math.floor(Math.max(0, xp) / XP_PER_LEVEL) + 1;
}

export const PVE_REWARDS = {
  win: { xp: 50, softCurrency: 100 },
  loss: { xp: 20, softCurrency: 40 },
} as const;

export const PVP_REWARDS = {
  win: { xp: 30, softCurrency: 60 },
  loss: { xp: 10, softCurrency: 20 },
  draw: { xp: 15, softCurrency: 30 },
} as const;

export const STARTING_MMR = 1000;

export type RankTier = 'IRON' | 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND' | 'RAIDO';

export interface RankTierDefinition {
  tier: RankTier;
  minMmr: number;
  label: string;
}

/** Ordered ascending by minMmr — ranks 0-indexed cover the whole mmr range from IRON up. */
export const RANK_TIERS: RankTierDefinition[] = [
  { tier: 'IRON', minMmr: 0, label: 'Железо' },
  { tier: 'BRONZE', minMmr: 1000, label: 'Бронза' },
  { tier: 'SILVER', minMmr: 1200, label: 'Серебро' },
  { tier: 'GOLD', minMmr: 1400, label: 'Золото' },
  { tier: 'PLATINUM', minMmr: 1600, label: 'Платина' },
  { tier: 'DIAMOND', minMmr: 1800, label: 'Алмаз' },
  { tier: 'RAIDO', minMmr: 2000, label: 'Райдо' },
];

export function rankForMmr(mmr: number): RankTierDefinition {
  let current = RANK_TIERS[0]!;
  for (const tier of RANK_TIERS) {
    if (mmr >= tier.minMmr) current = tier;
    else break;
  }
  return current;
}

const MMR_K_FACTOR = 32;

export type MatchResult = 'WIN' | 'LOSS' | 'DRAW';

const RESULT_SCORE: Record<MatchResult, number> = { WIN: 1, LOSS: 0, DRAW: 0.5 };

/** Standard Elo expected-score formula: probability `playerMmr` beats `opponentMmr`. */
function expectedScore(playerMmr: number, opponentMmr: number): number {
  return 1 / (1 + 10 ** ((opponentMmr - playerMmr) / 400));
}

export function computeMmrDelta(
  playerMmr: number,
  opponentMmr: number,
  result: MatchResult,
): number {
  const expected = expectedScore(playerMmr, opponentMmr);
  return Math.round(MMR_K_FACTOR * (RESULT_SCORE[result] - expected));
}
