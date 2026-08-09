/**
 * Skeleton match/action types. Full authoritative game state lives in
 * packages/game-engine (Phase 2); these shapes are shared with API/WS payloads.
 */
export type GameAction =
  | { type: 'PLAY_CARD'; playerId: string; cardId: string; targetId?: string }
  | { type: 'ATTACK'; playerId: string; attackerId: string; targetId: string }
  | { type: 'END_TURN'; playerId: string };

export type MatchStatus = 'WAITING' | 'ACTIVE' | 'FINISHED' | 'ABANDONED';

export interface BoostSnapshotEntry {
  cardId: string;
  tier: number;
  boostPercent: number;
}

export interface MatchSummary {
  id: string;
  player1Id: string;
  player2Id: string;
  status: MatchStatus;
  winnerId?: string;
  startedAt?: string;
  finishedAt?: string;
}
