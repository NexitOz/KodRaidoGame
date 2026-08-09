import type { MatchState } from './types.js';

export interface CostPreview {
  cost: number;
  modifierIndex: number | null;
}

/** Pure lookup — does not consume the modifier. Safe to call for "can I afford this?" checks. */
export function previewEffectiveCost(
  state: MatchState,
  playerId: string,
  baseCost: number,
  tags: string[],
): CostPreview {
  const player = state.players[playerId]!;
  for (let i = 0; i < player.turnCostModifiers.length; i += 1) {
    const modifier = player.turnCostModifiers[i]!;
    if (modifier.usesRemaining <= 0) continue;
    if (modifier.tagFilter && !tags.includes(modifier.tagFilter)) continue;
    return { cost: Math.max(0, baseCost + modifier.amount), modifierIndex: i };
  }
  return { cost: baseCost, modifierIndex: null };
}

export function consumeCostModifier(
  state: MatchState,
  playerId: string,
  modifierIndex: number | null,
): void {
  if (modifierIndex === null) return;
  const modifier = state.players[playerId]!.turnCostModifiers[modifierIndex];
  if (modifier) modifier.usesRemaining -= 1;
}
