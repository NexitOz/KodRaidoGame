import type { MatchEventView, MatchRewards, MatchStateView } from './match-view.js';

/**
 * Wire contract for the WebSocket match gateway. Shared between the
 * game-server (emits/consumes these) and the web client (socket.io-client),
 * so the two never drift out of sync.
 */
export type MatchActionInput =
  | { type: 'PLAY_CARD'; cardId: string; targetId?: string }
  | { type: 'ATTACK'; attackerId: string; targetId: string }
  | { type: 'END_TURN' };

export interface MatchmakingJoinInput {
  deckId: string;
}

export interface MatchmakingStatus {
  queued: boolean;
  queuedAt?: string;
}

/** Client -> server: `match:join`, `match:action` payloads. */
export interface MatchJoinPayload {
  matchId: string;
}

export interface MatchActionPayload {
  matchId: string;
  action: MatchActionInput;
}

/** Server -> client: `match:found`, `match:state`, presence and error payloads. */
export interface MatchFoundPayload {
  matchId: string;
}

export interface MatchStatePayload {
  view: MatchStateView;
  events: MatchEventView[];
  rewards?: MatchRewards;
}

export interface MatchPresencePayload {
  matchId: string;
  graceSeconds?: number;
}

export interface MatchErrorPayload {
  message: string;
}
