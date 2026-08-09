import type { BoostSnapshotEntry, GameAction } from '@kod-raido/shared';

export type { GameAction };

export interface UnitInstance {
  instanceId: string;
  cardId: string;
  ownerId: string;
  attack: number;
  health: number;
  maxHealth: number;
  statuses: string[];
  summonedThisTurn: boolean;
}

export interface PlayerMatchState {
  playerId: string;
  conductorHp: number;
  energy: number;
  maxEnergy: number;
  hand: string[];
  deck: string[];
  discard: string[];
  board: UnitInstance[];
  fatigueDamage: number;
}

export interface MatchState {
  matchId: string;
  seed: string;
  turn: number;
  activePlayerId: string;
  players: Record<string, PlayerMatchState>;
  boostSnapshot: BoostSnapshotEntry[];
  finished: boolean;
  winnerId?: string;
}

export interface MatchContext {
  rulesVersion: string;
  boostSnapshot: BoostSnapshotEntry[];
}

export interface GameEvent {
  type: string;
  payload: Record<string, unknown>;
}

export interface ApplyActionResult {
  state: MatchState;
  events: GameEvent[];
  valid: boolean;
  error?: string;
}
