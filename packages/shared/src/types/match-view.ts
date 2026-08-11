import type { Card } from './card.js';
import type { StatusType } from './card.js';
import type { UnlockedRewardView } from './progression-view.js';

export interface CardInstanceView {
  instanceId: string;
  card: Card;
}

export interface UnitInstanceView {
  instanceId: string;
  card: Card;
  attack: number;
  health: number;
  maxHealth: number;
  statuses: StatusType[];
  summonedThisTurn: boolean;
  attackedThisTurn: boolean;
}

export interface PlayerStateView {
  playerId: string;
  isBot: boolean;
  conductorHp: number;
  energy: number;
  maxEnergy: number;
  /** Full card detail — only populated for the viewer's own side. */
  hand: CardInstanceView[];
  handCount: number;
  deckCount: number;
  discardCount: number;
  board: UnitInstanceView[];
  runeCardIds: string[];
}

export interface MatchStateView {
  matchId: string;
  turn: number;
  activePlayerId: string;
  finished: boolean;
  winnerId?: string;
  you: PlayerStateView;
  opponent: PlayerStateView;
}

export interface MatchEventView {
  type: string;
  payload: Record<string, unknown>;
}

export interface MatchRewards {
  xp: number;
  softCurrency: number;
  leveledUp: boolean;
  /** True if this reward included the once-per-UTC-day first-win bonus. */
  firstWinBonus: boolean;
  previousLevel: number;
  newLevel: number;
  /** Level-up rewards unlocked by this exact match (empty on a no-level-up or idempotent replay). */
  rewardsUnlocked: UnlockedRewardView[];
  /** Player's XP-bar position after this match's reward was applied. */
  currentLevelXp: number;
  nextLevelXp: number | null;
  progressPercent: number;
  /** Only set for ranked PvP matches. */
  mmrDelta?: number;
  newMmr?: number;
}

export interface MatchActionResponse {
  view: MatchStateView;
  events: MatchEventView[];
  rewards?: MatchRewards;
}

export interface MatchHistoryEntry {
  id: string;
  opponentLabel: string;
  status: 'ACTIVE' | 'FINISHED' | 'ABANDONED';
  won: boolean | null;
  startedAt: string;
  finishedAt?: string;
  xpAwarded: number;
  softCurrencyAwarded: number;
  mmrDelta?: number;
}
