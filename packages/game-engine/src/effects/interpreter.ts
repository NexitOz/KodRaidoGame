import {
  MAX_BOARD_UNITS,
  type Card,
  type EffectAction,
  type EffectTrigger,
} from '@kod-raido/shared';
import { createRng } from '../rng.js';
import { drawCard } from '../match/draw.js';
import type { GameEvent, MatchContext, MatchState, UnitInstance } from '../match/types.js';
import { applyBoost, boostPercentFor, nextInstanceId } from '../match/util.js';
import { checkConditions, markOncePerTurnUsed } from './conditions.js';
import { checkWinConditions, dealDamageToTarget, destroyTarget, healTarget } from './primitives.js';
import { resolveTargets, type ResolvedTarget } from './targets.js';

export interface RunEffectsInput {
  state: MatchState;
  matchCtx: MatchContext;
  trigger: EffectTrigger;
  ownerId: string;
  sourceCardId: string;
  sourceInstanceId?: string;
  triggerSourceInstanceId?: string;
  explicitTargetId?: string;
  events: GameEvent[];
}

export function runEffects(input: RunEffectsInput): void {
  const card = input.matchCtx.cards.get(input.sourceCardId);
  if (!card) return;

  const rng = createRng(
    `${input.state.seed}:${input.state.actionSequence}:${input.sourceCardId}:${input.sourceInstanceId ?? ''}`,
  );

  card.effects.forEach((definition, index) => {
    if (definition.trigger !== input.trigger) return;

    const effectKey = `${input.ownerId}:${input.sourceCardId}:${input.sourceInstanceId ?? 'x'}:${index}`;
    const conditionsOk = checkConditions(definition.conditions, {
      state: input.state,
      matchCtx: input.matchCtx,
      ownerId: input.ownerId,
      sourceCardId: input.sourceCardId,
      sourceInstanceId: input.sourceInstanceId,
      effectKey,
    });
    if (!conditionsOk) return;

    if (definition.conditions?.some((c) => c.type === 'ONCE_PER_TURN')) {
      markOncePerTurnUsed(input.state, effectKey);
    }

    for (const action of definition.effects) {
      executeAction(action, input, rng);
    }
  });
}

function executeAction(action: EffectAction, input: RunEffectsInput, rng: () => number): void {
  const targets = () =>
    resolveTargets(action.target, {
      state: input.state,
      matchCtx: input.matchCtx,
      ownerId: input.ownerId,
      sourceInstanceId: input.sourceInstanceId,
      triggerSourceInstanceId: input.triggerSourceInstanceId,
      explicitTargetId: input.explicitTargetId,
      tagFilter: action.tagFilter,
      rng,
    });

  switch (action.type) {
    case 'DAMAGE': {
      for (const t of targets())
        dealDamageToTarget(input.state, t, action.amount ?? 0, input.events);
      processDeaths(input.state, input.matchCtx, input.events);
      break;
    }

    case 'HEAL': {
      for (const t of targets()) healTarget(input.state, t, action.amount ?? 0, input.events);
      break;
    }

    case 'BUFF':
    case 'DEBUFF': {
      const sign = action.type === 'BUFF' ? 1 : -1;
      const atkDelta = sign * (action.attack ?? 0);
      const hpDelta = sign * (action.health ?? 0);
      for (const t of targets()) {
        if (t.kind !== 'unit') continue;
        const unit = findUnitOn(input.state, t);
        if (!unit) continue;

        unit.attack = Math.max(0, unit.attack + atkDelta);
        unit.maxHealth = Math.max(1, unit.maxHealth + hpDelta);
        unit.health = Math.min(unit.maxHealth, unit.health + hpDelta);

        input.events.push({
          type: action.type === 'BUFF' ? 'UNIT_BUFFED' : 'UNIT_DEBUFFED',
          payload: { instanceId: unit.instanceId, attackDelta: atkDelta, healthDelta: hpDelta },
        });

        if (action.duration === 'END_OF_TURN' || typeof action.duration === 'number') {
          input.state.pendingEndOfTurnReverts.push({
            unitInstanceId: unit.instanceId,
            attackDelta: atkDelta,
            healthDelta: hpDelta,
          });
        }
      }
      if (action.type === 'DEBUFF') processDeaths(input.state, input.matchCtx, input.events);
      break;
    }

    case 'DRAW': {
      for (let i = 0; i < (action.amount ?? 1); i += 1) {
        drawCard(input.state, input.ownerId, input.events);
      }
      break;
    }

    case 'SHIELD': {
      for (const t of targets()) {
        if (t.kind !== 'unit') continue;
        const unit = findUnitOn(input.state, t);
        if (unit && !unit.statuses.includes('SHIELD')) {
          unit.statuses.push('SHIELD');
          input.events.push({
            type: 'STATUS_ADDED',
            payload: { instanceId: unit.instanceId, status: 'SHIELD' },
          });
        }
      }
      break;
    }

    case 'SUMMON': {
      summonUnits(action, input);
      break;
    }

    case 'DESTROY': {
      for (const t of targets()) destroyTarget(input.state, t);
      processDeaths(input.state, input.matchCtx, input.events);
      break;
    }

    case 'COST_MODIFIER': {
      const player = input.state.players[input.ownerId]!;
      player.turnCostModifiers.push({
        tagFilter: action.tagFilter,
        amount: action.amount ?? 0,
        usesRemaining: 1,
      });
      input.events.push({
        type: 'COST_MODIFIER_REGISTERED',
        payload: {
          playerId: input.ownerId,
          amount: action.amount ?? 0,
          tagFilter: action.tagFilter ?? null,
        },
      });
      break;
    }

    case 'SILENCE': {
      for (const t of targets()) {
        if (t.kind !== 'unit') continue;
        const unit = findUnitOn(input.state, t);
        if (unit && !unit.statuses.includes('SILENCED')) {
          unit.statuses.push('SILENCED');
          input.events.push({
            type: 'STATUS_ADDED',
            payload: { instanceId: unit.instanceId, status: 'SILENCED' },
          });
        }
      }
      break;
    }

    case 'GAIN_ENERGY': {
      const player = input.state.players[input.ownerId]!;
      player.energy += action.amount ?? 0;
      input.events.push({
        type: 'ENERGY_GAINED',
        payload: { playerId: input.ownerId, amount: action.amount ?? 0 },
      });
      break;
    }

    case 'ADD_STATUS': {
      if (!action.status) break;
      for (const t of targets()) {
        if (t.kind !== 'unit') continue;
        const unit = findUnitOn(input.state, t);
        if (unit && !unit.statuses.includes(action.status)) {
          unit.statuses.push(action.status);
          input.events.push({
            type: 'STATUS_ADDED',
            payload: { instanceId: unit.instanceId, status: action.status },
          });
        }
      }
      break;
    }

    default:
      break;
  }
}

function findUnitOn(state: MatchState, target: ResolvedTarget): UnitInstance | undefined {
  if (target.kind !== 'unit') return undefined;
  return state.players[target.ownerId]?.board.find((u) => u.instanceId === target.instanceId);
}

function findCardBySlug(matchCtx: MatchContext, slug: string): Card | undefined {
  for (const card of matchCtx.cards.values()) {
    if (card.slug === slug) return card;
  }
  return undefined;
}

function summonUnits(action: EffectAction, input: RunEffectsInput): void {
  if (!action.summonCardSlug) return;
  const def = findCardBySlug(input.matchCtx, action.summonCardSlug);
  if (!def || def.type !== 'CHARACTER') return;

  const player = input.state.players[input.ownerId]!;
  const count = action.amount ?? 1;
  const boost = boostPercentFor(input.state, def.id);
  const attack = applyBoost(def.attack, boost);
  const health = applyBoost(def.health, boost);

  for (let i = 0; i < count; i += 1) {
    if (player.board.length >= MAX_BOARD_UNITS) {
      input.events.push({
        type: 'SUMMON_SKIPPED_BOARD_FULL',
        payload: { playerId: input.ownerId, cardId: def.id },
      });
      break;
    }
    const unit: UnitInstance = {
      instanceId: nextInstanceId(input.state, 'unit'),
      cardId: def.id,
      ownerId: input.ownerId,
      attack,
      health,
      maxHealth: health,
      statuses: [],
      summonedThisTurn: true,
      attackedThisTurn: false,
    };
    player.board.push(unit);
    input.events.push({
      type: 'UNIT_SUMMONED',
      payload: { instanceId: unit.instanceId, cardId: def.id, ownerId: input.ownerId },
    });
  }
}

/** Resolves board deaths (including chained deathrattles) until the board is stable. */
export function processDeaths(
  state: MatchState,
  matchCtx: MatchContext,
  events: GameEvent[],
): void {
  let guard = 0;
  let more = true;

  while (more && guard < 20) {
    guard += 1;
    more = false;

    for (const player of Object.values(state.players)) {
      const dead = player.board.filter((u) => u.health <= 0);
      if (dead.length === 0) continue;

      player.board = player.board.filter((u) => u.health > 0);
      for (const unit of dead) {
        events.push({
          type: 'UNIT_DIED',
          payload: { instanceId: unit.instanceId, cardId: unit.cardId, ownerId: player.playerId },
        });
        if (!unit.statuses.includes('SILENCED')) {
          runEffects({
            state,
            matchCtx,
            trigger: 'ON_DEATH',
            ownerId: player.playerId,
            sourceCardId: unit.cardId,
            sourceInstanceId: unit.instanceId,
            events,
          });
        }
        more = true;
      }
    }
  }

  checkWinConditions(state, events);
}

export function broadcastToRunes(
  state: MatchState,
  matchCtx: MatchContext,
  trigger: EffectTrigger,
  ownerId: string,
  events: GameEvent[],
  triggerSourceInstanceId?: string,
): void {
  const player = state.players[ownerId];
  if (!player) return;
  for (const runeCardId of player.runes) {
    runEffects({
      state,
      matchCtx,
      trigger,
      ownerId,
      sourceCardId: runeCardId,
      triggerSourceInstanceId,
      events,
    });
  }
}
