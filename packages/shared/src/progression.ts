// ---- Account Level Curve ----

export const MAX_LEVEL = 30;

/**
 * LEVEL_THRESHOLDS[i] = total XP required to reach level (i + 1). Level 1 requires 0 XP; each
 * subsequent level costs 20 more XP than the previous step (100, 120, 140, 160, ...), matching
 * the Player Progression & Economy 1.0 spec's worked example (L2=100, L3=220, L4=360, L5=520).
 */
const LEVEL_THRESHOLDS: number[] = buildLevelThresholds();

function buildLevelThresholds(): number[] {
  const thresholds = [0];
  for (let level = 2; level <= MAX_LEVEL; level += 1) {
    const step = 100 + 20 * (level - 2);
    thresholds.push(thresholds[level - 2]! + step);
  }
  return thresholds;
}

/** Total XP required to *reach* `level` (clamped to [1, MAX_LEVEL]). */
export function xpRequiredForLevel(level: number): number {
  const clamped = Math.min(Math.max(Math.trunc(level), 1), MAX_LEVEL);
  return LEVEL_THRESHOLDS[clamped - 1]!;
}

/** Account level implied by a total XP amount, clamped to [1, MAX_LEVEL]. */
export function levelForXp(totalXp: number): number {
  const xp = Math.max(0, totalXp);
  let level = 1;
  for (let i = 1; i < LEVEL_THRESHOLDS.length; i += 1) {
    if (xp >= LEVEL_THRESHOLDS[i]!) level = i + 1;
    else break;
  }
  return level;
}

/** Backward-compatible alias - existing callers across the codebase import this name. */
export const computeLevelForXp = levelForXp;

export interface LevelXpProgress {
  level: number;
  /** XP earned since reaching the current level. */
  currentLevelXp: number;
  /** XP needed to go from the current level to the next one (null once MAX_LEVEL is reached). */
  xpForNextLevel: number | null;
  /** 0-100, always 100 at MAX_LEVEL. */
  progressPercent: number;
}

export function xpProgressForLevel(totalXp: number): LevelXpProgress {
  const xp = Math.max(0, totalXp);
  const level = levelForXp(xp);
  const currentThreshold = xpRequiredForLevel(level);
  const currentLevelXp = xp - currentThreshold;

  if (level >= MAX_LEVEL) {
    return { level, currentLevelXp, xpForNextLevel: null, progressPercent: 100 };
  }

  const span = xpRequiredForLevel(level + 1) - currentThreshold;
  const progressPercent = span > 0 ? Math.min(100, Math.round((currentLevelXp / span) * 100)) : 100;
  return { level, currentLevelXp, xpForNextLevel: span, progressPercent };
}

// ---- Economy: XP / Soft Currency ("Эхо") rewards ----

/** Bump whenever REWARD_TABLE/FIRST_WIN_OF_DAY_BONUS numbers change - MatchReward rows persist
 * the version they were computed under so historical rewards are never silently recalculated. */
export const ECONOMY_VERSION = '1';

export type MatchMode = 'PVE' | 'CASUAL_PVP' | 'RANKED_PVP';
export type MatchOutcome = 'WIN' | 'LOSS';

export interface RewardAmount {
  xp: number;
  softCurrency: number;
}

/**
 * Central economy source of truth - see docs/player-progression-economy-01.md. CASUAL_PVP is
 * defined for architectural completeness even though no casual queue exists yet; the one live
 * PvP queue is MMR-rated, i.e. RANKED_PVP.
 */
export const REWARD_TABLE: Record<MatchMode, Record<MatchOutcome, RewardAmount>> = {
  PVE: {
    WIN: { xp: 60, softCurrency: 25 },
    LOSS: { xp: 35, softCurrency: 10 },
  },
  CASUAL_PVP: {
    WIN: { xp: 90, softCurrency: 35 },
    LOSS: { xp: 55, softCurrency: 15 },
  },
  RANKED_PVP: {
    WIN: { xp: 110, softCurrency: 45 },
    LOSS: { xp: 65, softCurrency: 20 },
  },
};

/**
 * A draw is treated as a loss for reward purposes - the spec's reward table only defines
 * WIN/LOSS tiers, draws are rare (both conductors reach 0 the same turn), and paying the lesser
 * tier avoids inventing an unspecified third number.
 */
export type MatchResult = 'WIN' | 'LOSS' | 'DRAW';

export function rewardOutcomeFor(result: MatchResult): MatchOutcome {
  return result === 'WIN' ? 'WIN' : 'LOSS';
}

export function rewardFor(mode: MatchMode, result: MatchResult): RewardAmount {
  return REWARD_TABLE[mode][rewardOutcomeFor(result)];
}

/** Once per account per UTC calendar day, only for a WIN in a reward-bearing match. */
export const FIRST_WIN_OF_DAY_BONUS: RewardAmount = { xp: 50, softCurrency: 50 };

/**
 * One-time reward for completing the tutorial - never a power advantage, no premium currency.
 * Granted by TutorialService.complete(), a separate one-time-claim path from
 * MatchRewardService - see docs/player-progression-economy-01.md.
 */
export const TUTORIAL_REWARD = { xp: 100, softCurrency: 300 } as const;

// ---- Level-up rewards (levels 2-10) ----

export type LevelRewardDef =
  | { type: 'CURRENCY'; amount: number }
  | { type: 'COSMETIC'; key: string; label: string };

/**
 * Data-driven, minimal unlock model - no dedicated skins/cosmetics subsystem. Cosmetic keys are
 * original Kod Raido placeholders (profile badge/emblem/frame, card-back), no third-party IP,
 * granted via a generic UserUnlock row and rendered as a labelled chip until real art exists.
 */
export const LEVEL_REWARDS: Record<number, LevelRewardDef> = {
  2: { type: 'CURRENCY', amount: 100 },
  3: { type: 'CURRENCY', amount: 150 },
  4: { type: 'COSMETIC', key: 'profile_badge_lvl4', label: 'Значок профиля' },
  5: { type: 'CURRENCY', amount: 200 },
  6: { type: 'COSMETIC', key: 'card_back_lvl6', label: 'Рубашка карты' },
  7: { type: 'CURRENCY', amount: 250 },
  8: { type: 'COSMETIC', key: 'profile_emblem_lvl8', label: 'Эмблема профиля' },
  9: { type: 'CURRENCY', amount: 300 },
  10: { type: 'COSMETIC', key: 'raido_frame_lvl10', label: 'Рамка RAIDO' },
};

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
