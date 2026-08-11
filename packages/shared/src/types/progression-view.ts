/** A single unlocked level-up reward, already resolved to a client-displayable shape. */
export type UnlockedRewardView =
  | { level: number; type: 'CURRENCY'; amount: number }
  | { level: number; type: 'COSMETIC'; key: string; label: string };

/** The reward the player will get for reaching the next level - shown as "coming up" preview. */
export interface NextRewardPreview {
  level: number;
  xpNeeded: number;
  reward: UnlockedRewardView | null;
}

/** GET /me/progression - server-computed, client never re-derives progression rules. */
export interface ProgressionView {
  level: number;
  totalXp: number;
  currentLevelXp: number;
  /** XP span required to complete the current level; null once MAX_LEVEL is reached. */
  nextLevelXp: number | null;
  progressPercent: number;
  softCurrency: number;
  firstWinClaimedToday: boolean;
  nextReward: NextRewardPreview | null;
  unlockedCosmetics: number;
  stats: {
    wins: number;
    losses: number;
    winRate: number;
    pveWins: number;
    pvpWins: number;
  };
}
