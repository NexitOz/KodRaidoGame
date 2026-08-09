import { MAX_ENERGY } from '@kod-raido/shared';
import { broadcastToRunes } from '../effects/interpreter.js';
import { drawCard } from './draw.js';
import type { GameEvent, MatchContext, MatchState } from './types.js';
import { getOpponentId } from './util.js';

function revertEndOfTurnEffects(state: MatchState): void {
  for (const revert of state.pendingEndOfTurnReverts) {
    for (const player of Object.values(state.players)) {
      const unit = player.board.find((u) => u.instanceId === revert.unitInstanceId);
      if (!unit) continue;
      unit.attack = Math.max(0, unit.attack - revert.attackDelta);
      unit.maxHealth = Math.max(1, unit.maxHealth - revert.healthDelta);
      unit.health = Math.min(unit.health, unit.maxHealth);
    }
  }
  state.pendingEndOfTurnReverts = [];
}

export function startTurn(state: MatchState, matchCtx: MatchContext, events: GameEvent[]): void {
  const playerId = state.activePlayerId;
  const player = state.players[playerId]!;

  player.maxEnergy = Math.min(MAX_ENERGY, state.turn);
  player.energy = player.maxEnergy;
  player.cardsPlayedThisTurn = 0;
  player.turnCostModifiers = [];

  for (const unit of player.board) {
    unit.summonedThisTurn = false;
    unit.attackedThisTurn = false;
  }

  if (state.turn > 1) {
    drawCard(state, playerId, events);
  }

  events.push({
    type: 'TURN_START',
    payload: { playerId, turn: state.turn, energy: player.energy },
  });
  broadcastToRunes(state, matchCtx, 'TURN_START', playerId, events);
}

export function endTurn(state: MatchState, matchCtx: MatchContext, events: GameEvent[]): void {
  const playerId = state.activePlayerId;

  broadcastToRunes(state, matchCtx, 'TURN_END', playerId, events);
  revertEndOfTurnEffects(state);
  events.push({ type: 'TURN_END', payload: { playerId, turn: state.turn } });

  if (state.finished) return;

  state.activePlayerId = getOpponentId(state, playerId);
  state.turn += 1;
  startTurn(state, matchCtx, events);
}
