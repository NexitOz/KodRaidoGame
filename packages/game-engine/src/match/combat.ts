import { runEffects, processDeaths } from '../effects/interpreter.js';
import { dealDamageToTarget } from '../effects/primitives.js';
import type { GameEvent, MatchContext, MatchState } from './types.js';
import { findUnit, getOpponentId } from './util.js';

export function resolveAttack(
  state: MatchState,
  matchCtx: MatchContext,
  ownerId: string,
  attackerInstanceId: string,
  targetId: string,
  events: GameEvent[],
): void {
  const attackerLookup = findUnit(state, attackerInstanceId);
  if (!attackerLookup) return;
  const attacker = attackerLookup.unit;

  events.push({
    type: 'ATTACK_DECLARED',
    payload: { playerId: ownerId, attackerId: attacker.instanceId, targetId },
  });

  if (!attacker.statuses.includes('SILENCED')) {
    runEffects({
      state,
      matchCtx,
      trigger: 'ON_ATTACK',
      ownerId,
      sourceCardId: attacker.cardId,
      sourceInstanceId: attacker.instanceId,
      events,
    });
  }

  const opponentId = getOpponentId(state, ownerId);

  if (targetId === opponentId) {
    dealDamageToTarget(state, { kind: 'conductor', playerId: opponentId }, attacker.attack, events);
  } else {
    const defenderLookup = findUnit(state, targetId);
    if (!defenderLookup) return;
    const defender = defenderLookup.unit;
    const defenderAttack = defender.attack;

    dealDamageToTarget(
      state,
      { kind: 'unit', ownerId: defenderLookup.ownerId, instanceId: defender.instanceId },
      attacker.attack,
      events,
    );
    dealDamageToTarget(
      state,
      { kind: 'unit', ownerId, instanceId: attacker.instanceId },
      defenderAttack,
      events,
    );
  }

  processDeaths(state, matchCtx, events);
}
