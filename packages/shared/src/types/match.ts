/**
 * Match/action wire types shared between the game-server, web client and
 * packages/game-engine (which owns the authoritative MatchState shape).
 *
 * `PLAY_CARD.cardId` identifies a specific *card instance* in the player's
 * hand (each hand card gets a unique instance id when dealt), not the card
 * definition — a hand can hold two copies of the same definition.
 * `ATTACK.targetId` / `PLAY_CARD.targetId` may reference either a board unit
 * instance id or an opposing player's id, which the engine resolves as an
 * attack/effect against that player's Conductor.
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
