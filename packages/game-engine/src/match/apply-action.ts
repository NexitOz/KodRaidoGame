import { MAX_BOARD_UNITS } from '@kod-raido/shared';
import { broadcastToRunes, processDeaths, runEffects } from '../effects/interpreter.js';
import { resolveAttack } from './combat.js';
import { consumeCostModifier, previewEffectiveCost } from './cost.js';
import { startTurn, endTurn } from './turn.js';
import type {
  ApplyActionResult,
  GameAction,
  GameEvent,
  MatchContext,
  MatchState,
  UnitInstance,
} from './types.js';
import { applyBoost, boostPercentFor, findUnit, nextInstanceId } from './util.js';

function invalid(state: MatchState, error: string): ApplyActionResult {
  return { state, events: [], valid: false, error };
}

function handlePlayCard(
  state: MatchState,
  matchCtx: MatchContext,
  playerId: string,
  instanceId: string,
  targetId: string | undefined,
  events: GameEvent[],
): ApplyActionResult {
  const player = state.players[playerId]!;
  const handIndex = player.hand.findIndex((c) => c.instanceId === instanceId);
  if (handIndex === -1) return invalid(state, 'Card is not in hand.');

  const handCard = player.hand[handIndex]!;
  const card = matchCtx.cards.get(handCard.cardId);
  if (!card || !card.active || !card.isPlayable || card.rightsStatus === 'blocked') {
    return invalid(state, 'Card is not playable.');
  }

  const { cost: effectiveCost, modifierIndex } = previewEffectiveCost(
    state,
    playerId,
    card.cost,
    card.tags,
  );
  if (player.energy < effectiveCost) return invalid(state, 'Not enough energy.');

  if (card.type === 'CHARACTER' && player.board.length >= MAX_BOARD_UNITS) {
    return invalid(state, 'Board is full.');
  }

  consumeCostModifier(state, playerId, modifierIndex);
  player.hand.splice(handIndex, 1);
  player.energy -= effectiveCost;
  player.cardsPlayedThisTurn += 1;
  events.push({
    type: 'CARD_PLAYED',
    payload: { playerId, cardId: card.id, instanceId: handCard.instanceId, cost: effectiveCost },
  });

  let newUnitInstanceId: string | undefined;

  if (card.type === 'CHARACTER') {
    const boost = boostPercentFor(state, card.id);
    const unit: UnitInstance = {
      instanceId: nextInstanceId(state, 'unit'),
      cardId: card.id,
      ownerId: playerId,
      attack: applyBoost(card.attack, boost),
      health: applyBoost(card.health, boost),
      maxHealth: applyBoost(card.health, boost),
      statuses: [],
      summonedThisTurn: true,
      attackedThisTurn: false,
    };
    player.board.push(unit);
    newUnitInstanceId = unit.instanceId;
    events.push({
      type: 'UNIT_SUMMONED',
      payload: { instanceId: unit.instanceId, cardId: card.id, ownerId: playerId },
    });

    runEffects({
      state,
      matchCtx,
      trigger: 'ON_PLAY',
      ownerId: playerId,
      sourceCardId: card.id,
      sourceInstanceId: unit.instanceId,
      explicitTargetId: targetId,
      events,
    });
    // Only character plays trigger reactive rune listeners (e.g. "first character each turn").
    broadcastToRunes(state, matchCtx, 'ON_PLAY', playerId, events, newUnitInstanceId);
  } else if (card.type === 'TRACK') {
    player.discard.push(handCard);
    runEffects({
      state,
      matchCtx,
      trigger: 'ON_TRACK_PLAYED',
      ownerId: playerId,
      sourceCardId: card.id,
      explicitTargetId: targetId,
      events,
    });
    broadcastToRunes(state, matchCtx, 'ON_TRACK_PLAYED', playerId, events);
  } else if (card.type === 'RUNE') {
    player.runes.push(card.id);
    events.push({ type: 'RUNE_ACTIVATED', payload: { playerId, cardId: card.id } });
  } else {
    // EVENT / EDIT: one-shot effect, then discard.
    player.discard.push(handCard);
    runEffects({
      state,
      matchCtx,
      trigger: 'ON_PLAY',
      ownerId: playerId,
      sourceCardId: card.id,
      explicitTargetId: targetId,
      events,
    });
  }

  processDeaths(state, matchCtx, events);
  return { state, events, valid: true };
}

function handleAttack(
  state: MatchState,
  matchCtx: MatchContext,
  playerId: string,
  attackerId: string,
  targetId: string,
  events: GameEvent[],
): ApplyActionResult {
  const attackerLookup = findUnit(state, attackerId);
  if (!attackerLookup || attackerLookup.ownerId !== playerId) {
    return invalid(state, 'Attacker not found on your board.');
  }
  const attacker = attackerLookup.unit;

  if (attacker.attackedThisTurn) return invalid(state, 'This unit already attacked this turn.');
  if (attacker.summonedThisTurn && !attacker.statuses.includes('IMPULSE')) {
    return invalid(state, 'This unit cannot attack the turn it was summoned.');
  }

  const opponentId = Object.keys(state.players).find((id) => id !== playerId)!;
  if (targetId !== opponentId) {
    const defenderLookup = findUnit(state, targetId);
    if (!defenderLookup || defenderLookup.ownerId !== opponentId) {
      return invalid(state, 'Invalid attack target.');
    }
    if (defenderLookup.unit.statuses.includes('HIDDEN')) {
      return invalid(state, 'Target cannot be selected while Hidden.');
    }
  }

  attacker.attackedThisTurn = true;
  resolveAttack(state, matchCtx, playerId, attackerId, targetId, events);
  return { state, events, valid: true };
}

function handleEndTurn(
  state: MatchState,
  matchCtx: MatchContext,
  events: GameEvent[],
): ApplyActionResult {
  endTurn(state, matchCtx, events);
  return { state, events, valid: true };
}

export function applyAction(
  state: MatchState,
  action: GameAction,
  matchCtx: MatchContext,
): ApplyActionResult {
  if (state.finished) return invalid(state, 'Match already finished.');

  const player = state.players[action.playerId];
  if (!player) return invalid(state, 'Unknown player.');
  if (action.playerId !== state.activePlayerId) return invalid(state, "Not this player's turn.");

  const draft = structuredClone(state);
  draft.actionSequence += 1;
  const events: GameEvent[] = [];

  switch (action.type) {
    case 'PLAY_CARD':
      return handlePlayCard(
        draft,
        matchCtx,
        action.playerId,
        action.cardId,
        action.targetId,
        events,
      );
    case 'ATTACK':
      return handleAttack(
        draft,
        matchCtx,
        action.playerId,
        action.attackerId,
        action.targetId,
        events,
      );
    case 'END_TURN':
      return handleEndTurn(draft, matchCtx, events);
    default:
      return invalid(state, 'Unknown action type.');
  }
}

/** Convenience helper for callers (bot, tests) that just want to start the match's opening turn hooks. */
export function beginMatch(
  state: MatchState,
  matchCtx: MatchContext,
): { state: MatchState; events: GameEvent[] } {
  const draft = structuredClone(state);
  const events: GameEvent[] = [];
  startTurn(draft, matchCtx, events);
  return { state: draft, events };
}
