import type { Card, EffectTargetSelector } from '@kod-raido/shared';
import { getOpponentId } from '../match/util.js';
import type { MatchContext, MatchState, UnitInstance } from '../match/types.js';

export type ResolvedTarget =
  { kind: 'unit'; ownerId: string; instanceId: string } | { kind: 'conductor'; playerId: string };

export interface TargetResolutionInput {
  state: MatchState;
  matchCtx: MatchContext;
  ownerId: string;
  sourceInstanceId?: string;
  triggerSourceInstanceId?: string;
  explicitTargetId?: string;
  tagFilter?: string;
  rng: () => number;
}

function unitHasTag(matchCtx: MatchContext, unit: UnitInstance, tag: string): boolean {
  const card = matchCtx.cards.get(unit.cardId);
  return card ? card.tags.includes(tag) : false;
}

function filterByTag(
  units: UnitInstance[],
  matchCtx: MatchContext,
  tagFilter?: string,
): UnitInstance[] {
  if (!tagFilter) return units;
  return units.filter((u) => unitHasTag(matchCtx, u, tagFilter));
}

export function resolveTargets(
  selector: EffectTargetSelector | undefined,
  input: TargetResolutionInput,
): ResolvedTarget[] {
  if (!selector) return [];
  const opponentId = getOpponentId(input.state, input.ownerId);
  const own = input.state.players[input.ownerId]!;
  const enemy = input.state.players[opponentId]!;

  switch (selector) {
    case 'SELF':
      return input.sourceInstanceId
        ? [{ kind: 'unit', ownerId: input.ownerId, instanceId: input.sourceInstanceId }]
        : [];

    case 'TRIGGER_SOURCE':
      return input.triggerSourceInstanceId
        ? [{ kind: 'unit', ownerId: input.ownerId, instanceId: input.triggerSourceInstanceId }]
        : [];

    case 'FRIENDLY_ALL':
      return filterByTag(own.board, input.matchCtx, input.tagFilter).map((u) => ({
        kind: 'unit',
        ownerId: input.ownerId,
        instanceId: u.instanceId,
      }));

    case 'ENEMY_ALL':
      return filterByTag(enemy.board, input.matchCtx, input.tagFilter).map((u) => ({
        kind: 'unit',
        ownerId: opponentId,
        instanceId: u.instanceId,
      }));

    case 'FRIENDLY_RANDOM': {
      const pool = filterByTag(own.board, input.matchCtx, input.tagFilter);
      if (pool.length === 0) return [];
      const pick = pool[Math.floor(input.rng() * pool.length)]!;
      return [{ kind: 'unit', ownerId: input.ownerId, instanceId: pick.instanceId }];
    }

    case 'ENEMY_RANDOM': {
      const pool = filterByTag(
        enemy.board.filter((u) => !u.statuses.includes('HIDDEN')),
        input.matchCtx,
        input.tagFilter,
      );
      if (pool.length === 0) return [];
      const pick = pool[Math.floor(input.rng() * pool.length)]!;
      return [{ kind: 'unit', ownerId: opponentId, instanceId: pick.instanceId }];
    }

    case 'FRIENDLY_CONDUCTOR':
      return [{ kind: 'conductor', playerId: input.ownerId }];

    case 'ENEMY_CONDUCTOR':
      return [{ kind: 'conductor', playerId: opponentId }];

    case 'FRIENDLY_CHOSEN': {
      if (!input.explicitTargetId) return [];
      if (input.explicitTargetId === input.ownerId) {
        return [{ kind: 'conductor', playerId: input.ownerId }];
      }
      const unit = own.board.find((u) => u.instanceId === input.explicitTargetId);
      return unit ? [{ kind: 'unit', ownerId: input.ownerId, instanceId: unit.instanceId }] : [];
    }

    case 'ENEMY_CHOSEN': {
      if (!input.explicitTargetId) return [];
      if (input.explicitTargetId === opponentId) {
        return [{ kind: 'conductor', playerId: opponentId }];
      }
      const unit = enemy.board.find(
        (u) => u.instanceId === input.explicitTargetId && !u.statuses.includes('HIDDEN'),
      );
      return unit ? [{ kind: 'unit', ownerId: opponentId, instanceId: unit.instanceId }] : [];
    }

    default:
      return [];
  }
}

export function cardTags(matchCtx: MatchContext, cardId: string): string[] {
  const card: Card | undefined = matchCtx.cards.get(cardId);
  return card?.tags ?? [];
}
