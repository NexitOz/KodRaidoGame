import { STARTING_CONDUCTOR_HP } from '@kod-raido/shared';
import type { GameEvent, MatchState } from '../match/types.js';
import type { ResolvedTarget } from './targets.js';

export function dealDamageToTarget(
  state: MatchState,
  target: ResolvedTarget,
  amount: number,
  events: GameEvent[],
): void {
  if (amount <= 0) return;

  if (target.kind === 'conductor') {
    const player = state.players[target.playerId]!;
    player.conductorHp = Math.max(0, player.conductorHp - amount);
    events.push({
      type: 'CONDUCTOR_DAMAGED',
      payload: { playerId: target.playerId, amount, conductorHp: player.conductorHp },
    });
    checkWinConditions(state, events);
    return;
  }

  const owner = state.players[target.ownerId]!;
  const unit = owner.board.find((u) => u.instanceId === target.instanceId);
  if (!unit) return;

  if (unit.statuses.includes('SHIELD')) {
    unit.statuses = unit.statuses.filter((s) => s !== 'SHIELD');
    events.push({ type: 'SHIELD_CONSUMED', payload: { instanceId: unit.instanceId } });
    return;
  }

  unit.health -= amount;
  events.push({
    type: 'UNIT_DAMAGED',
    payload: { instanceId: unit.instanceId, ownerId: owner.playerId, amount, health: unit.health },
  });
}

export function healTarget(
  state: MatchState,
  target: ResolvedTarget,
  amount: number,
  events: GameEvent[],
): void {
  if (amount <= 0) return;

  if (target.kind === 'conductor') {
    const player = state.players[target.playerId]!;
    const before = player.conductorHp;
    player.conductorHp = Math.min(STARTING_CONDUCTOR_HP, player.conductorHp + amount);
    if (player.conductorHp !== before) {
      events.push({
        type: 'CONDUCTOR_HEALED',
        payload: {
          playerId: target.playerId,
          amount: player.conductorHp - before,
          conductorHp: player.conductorHp,
        },
      });
    }
    return;
  }

  const owner = state.players[target.ownerId]!;
  const unit = owner.board.find((u) => u.instanceId === target.instanceId);
  if (!unit) return;

  const before = unit.health;
  unit.health = Math.min(unit.maxHealth, unit.health + amount);
  if (unit.health !== before) {
    events.push({
      type: 'UNIT_HEALED',
      payload: {
        instanceId: unit.instanceId,
        ownerId: owner.playerId,
        amount: unit.health - before,
        health: unit.health,
      },
    });
  }
}

export function destroyTarget(state: MatchState, target: ResolvedTarget): void {
  if (target.kind !== 'unit') return;
  const owner = state.players[target.ownerId]!;
  const unit = owner.board.find((u) => u.instanceId === target.instanceId);
  if (unit) unit.health = 0;
}

export function checkWinConditions(state: MatchState, events: GameEvent[]): void {
  if (state.finished) return;
  const ids = Object.keys(state.players);
  const dead = ids.filter((id) => state.players[id]!.conductorHp <= 0);
  if (dead.length === 0) return;

  state.finished = true;
  state.winnerId = dead.length === 2 ? undefined : ids.find((id) => !dead.includes(id));
  events.push({ type: 'MATCH_FINISHED', payload: { winnerId: state.winnerId ?? null } });
}
