import type { EffectCondition } from '@kod-raido/shared';
import type { MatchContext, MatchState } from '../match/types.js';

export interface ConditionContext {
  state: MatchState;
  matchCtx: MatchContext;
  ownerId: string;
  sourceCardId: string;
  sourceInstanceId?: string;
  effectKey: string;
}

export function checkConditions(
  conditions: EffectCondition[] | undefined,
  ctx: ConditionContext,
): boolean {
  if (!conditions || conditions.length === 0) return true;
  return conditions.every((condition) => checkCondition(condition, ctx));
}

function checkCondition(condition: EffectCondition, ctx: ConditionContext): boolean {
  switch (condition.type) {
    case 'ALWAYS':
      return true;

    case 'RESONANCE_TIER_AT_LEAST': {
      const tier =
        ctx.state.boostSnapshot.find((entry) => entry.cardId === ctx.sourceCardId)?.tier ?? 0;
      return tier >= Number(condition.value ?? 0);
    }

    case 'HAS_TAG_ON_BOARD': {
      const tag = String(condition.value ?? '');
      const board = ctx.state.players[ctx.ownerId]?.board ?? [];
      return board.some(
        (unit) =>
          unit.instanceId !== ctx.sourceInstanceId &&
          (ctx.matchCtx.cards.get(unit.cardId)?.tags.includes(tag) ?? false),
      );
    }

    case 'IS_FIRST_CARD_THIS_TURN':
      return (ctx.state.players[ctx.ownerId]?.cardsPlayedThisTurn ?? 0) === 1;

    case 'ONCE_PER_TURN':
      return (ctx.state.effectUsage[`${ctx.state.turn}:${ctx.effectKey}`] ?? 0) === 0;

    case 'TARGET_HAS_TAG':
      return true;

    default:
      return true;
  }
}

export function markOncePerTurnUsed(state: MatchState, effectKey: string): void {
  const key = `${state.turn}:${effectKey}`;
  state.effectUsage[key] = (state.effectUsage[key] ?? 0) + 1;
}
