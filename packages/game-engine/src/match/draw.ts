import { MAX_HAND_SIZE } from '@kod-raido/shared';
import { checkWinConditions } from '../effects/primitives.js';
import type { GameEvent, MatchState } from './types.js';

export function drawCard(state: MatchState, playerId: string, events: GameEvent[]): void {
  const player = state.players[playerId]!;
  const card = player.deck.shift();

  if (!card) {
    player.fatigueDamage += 1;
    player.conductorHp = Math.max(0, player.conductorHp - player.fatigueDamage);
    events.push({
      type: 'FATIGUE_DAMAGE',
      payload: { playerId, amount: player.fatigueDamage, conductorHp: player.conductorHp },
    });
    checkWinConditions(state, events);
    return;
  }

  if (player.hand.length >= MAX_HAND_SIZE) {
    player.discard.push(card);
    events.push({ type: 'CARD_BURNED', payload: { playerId, cardId: card.cardId } });
    return;
  }

  player.hand.push(card);
  events.push({
    type: 'CARD_DRAWN',
    payload: { playerId, instanceId: card.instanceId, cardId: card.cardId },
  });
}
