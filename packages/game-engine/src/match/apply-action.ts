import type { ApplyActionResult, GameAction, MatchContext, MatchState } from './types.js';

/**
 * Phase 0/1 skeleton. The deterministic turn/energy/combat rules land in
 * Phase 2 (see docs/progress.md); for now this only validates the action
 * shape so the API surface is stable for callers built during Phase 1.
 */
export function applyAction(
  state: MatchState,
  action: GameAction,
  _context: MatchContext,
): ApplyActionResult {
  if (state.finished) {
    return { state, events: [], valid: false, error: 'Match already finished.' };
  }

  const player = state.players[action.playerId];
  if (!player) {
    return { state, events: [], valid: false, error: 'Unknown player.' };
  }

  if (action.playerId !== state.activePlayerId) {
    return { state, events: [], valid: false, error: "Not this player's turn." };
  }

  return {
    state,
    events: [{ type: 'ACTION_ACCEPTED_PLACEHOLDER', payload: { action } }],
    valid: false,
    error: 'Game engine rules are implemented in Phase 2.',
  };
}
