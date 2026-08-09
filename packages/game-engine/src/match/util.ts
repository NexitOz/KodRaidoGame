import type { Card } from '@kod-raido/shared';
import type { MatchContext, MatchState, UnitInstance } from './types.js';

export function getOpponentId(state: MatchState, playerId: string): string {
  const ids = Object.keys(state.players);
  const opponent = ids.find((id) => id !== playerId);
  if (!opponent) throw new Error(`No opponent found for player ${playerId}.`);
  return opponent;
}

export function getCardDef(matchCtx: MatchContext, cardId: string): Card {
  const card = matchCtx.cards.get(cardId);
  if (!card) throw new Error(`Unknown card definition: ${cardId}.`);
  return card;
}

export function nextInstanceId(state: MatchState, prefix: string): string {
  state.instanceCounter += 1;
  return `${prefix}-${state.instanceCounter}`;
}

export interface UnitLookup {
  unit: UnitInstance;
  ownerId: string;
}

export function findUnit(state: MatchState, instanceId: string): UnitLookup | undefined {
  for (const player of Object.values(state.players)) {
    const unit = player.board.find((u) => u.instanceId === instanceId);
    if (unit) return { unit, ownerId: player.playerId };
  }
  return undefined;
}

export function removeUnit(state: MatchState, instanceId: string): void {
  for (const player of Object.values(state.players)) {
    const idx = player.board.findIndex((u) => u.instanceId === instanceId);
    if (idx >= 0) {
      player.board.splice(idx, 1);
      return;
    }
  }
}

export function boostPercentFor(state: MatchState, cardId: string): number {
  return state.boostSnapshot.find((entry) => entry.cardId === cardId)?.boostPercent ?? 0;
}

export function applyBoost(base: number, boostPercent: number): number {
  return Math.round(base * (1 + boostPercent / 100));
}
