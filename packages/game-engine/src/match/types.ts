import type { BoostSnapshotEntry, Card, GameAction, StatusType } from '@kod-raido/shared';

export type { GameAction };

/** A specific copy of a card definition sitting in a deck/hand/discard pile. */
export interface CardInstance {
  instanceId: string;
  cardId: string;
}

export interface UnitInstance {
  instanceId: string;
  cardId: string;
  ownerId: string;
  attack: number;
  health: number;
  maxHealth: number;
  statuses: StatusType[];
  summonedThisTurn: boolean;
  attackedThisTurn: boolean;
}

export interface EndOfTurnRevert {
  unitInstanceId: string;
  attackDelta: number;
  healthDelta: number;
}

export interface TurnCostModifier {
  tagFilter?: string;
  amount: number;
  usesRemaining: number;
}

export interface PlayerMatchState {
  playerId: string;
  conductorHp: number;
  energy: number;
  maxEnergy: number;
  hand: CardInstance[];
  deck: CardInstance[];
  discard: CardInstance[];
  board: UnitInstance[];
  runes: string[];
  fatigueDamage: number;
  cardsPlayedThisTurn: number;
  turnCostModifiers: TurnCostModifier[];
}

export interface MatchState {
  matchId: string;
  seed: string;
  rulesVersion: string;
  turn: number;
  activePlayerId: string;
  players: Record<string, PlayerMatchState>;
  boostSnapshot: BoostSnapshotEntry[];
  actionSequence: number;
  instanceCounter: number;
  effectUsage: Record<string, number>;
  pendingEndOfTurnReverts: EndOfTurnRevert[];
  finished: boolean;
  winnerId?: string;
}

export interface MatchContext {
  rulesVersion: string;
  /** Card definitions keyed by id, resolved once by the caller (game-server/tests). */
  cards: Map<string, Card>;
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
