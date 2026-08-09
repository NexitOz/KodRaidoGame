import { describe, expect, it } from 'vitest';
import { chooseBotAction } from '../bot/pve-bot.js';
import { makeCharacter, makeContext, makeEvent } from '../test-helpers.js';
import { applyAction, beginMatch } from './apply-action.js';
import { createMatch } from './match-setup.js';
import type { GameAction } from './types.js';

function buildDeck() {
  const vanilla1 = makeCharacter({ id: 'v1', cost: 1, attack: 1, health: 2 });
  const vanilla2 = makeCharacter({ id: 'v2', cost: 2, attack: 2, health: 3 });
  const vanilla3 = makeCharacter({ id: 'v3', cost: 3, attack: 3, health: 4 });
  const vanilla4 = makeCharacter({ id: 'v4', cost: 4, attack: 4, health: 5 });
  const bolt = makeEvent({
    id: 'bolt',
    cost: 2,
    effects: [
      {
        trigger: 'ON_PLAY',
        conditions: [],
        effects: [{ type: 'DAMAGE', target: 'ENEMY_CHOSEN', amount: 3 }],
      },
    ],
  });
  const cards = [vanilla1, vanilla2, vanilla3, vanilla4, bolt];
  const deck = [
    { cardId: vanilla1.id, quantity: 8 },
    { cardId: vanilla2.id, quantity: 8 },
    { cardId: vanilla3.id, quantity: 8 },
    { cardId: vanilla4.id, quantity: 4 },
    { cardId: bolt.id, quantity: 2 },
  ];
  return { cards, deck };
}

function simulateMatch(seed: string) {
  const { cards, deck } = buildDeck();
  const matchCtx = makeContext(cards);

  let state = createMatch({
    matchId: 'sim',
    seed,
    rulesVersion: 'test',
    player1: { playerId: 'p1', deck },
    player2: { playerId: 'p2', deck },
  });
  state = beginMatch(state, matchCtx).state;

  const MAX_ACTIONS = 2000;
  let actionsTaken = 0;

  while (!state.finished && actionsTaken < MAX_ACTIONS) {
    const action: GameAction = chooseBotAction(state, matchCtx, state.activePlayerId, 'NORMAL');
    const result = applyAction(state, action, matchCtx);
    if (!result.valid) {
      throw new Error(
        `Bot produced an illegal action: ${JSON.stringify(action)} — ${result.error}`,
      );
    }
    state = result.state;
    actionsTaken += 1;
  }

  return { state, actionsTaken };
}

describe('full simulated match', () => {
  it('always terminates with a finished match state, never looping forever', () => {
    const { state, actionsTaken } = simulateMatch('full-match-seed-1');
    expect(state.finished).toBe(true);
    expect(actionsTaken).toBeLessThan(2000);
  });

  it('produces a winner (or an explicit draw) and both Conductors stay within [0, 30]', () => {
    const { state } = simulateMatch('full-match-seed-2');
    expect(state.finished).toBe(true);
    for (const player of Object.values(state.players)) {
      expect(player.conductorHp).toBeGreaterThanOrEqual(0);
      expect(player.conductorHp).toBeLessThanOrEqual(30);
    }
    if (state.winnerId) {
      expect(Object.keys(state.players)).toContain(state.winnerId);
    }
  });

  it('is fully deterministic for a fixed seed', () => {
    const a = simulateMatch('deterministic-full-match');
    const b = simulateMatch('deterministic-full-match');
    expect(a.state.winnerId).toBe(b.state.winnerId);
    expect(a.actionsTaken).toBe(b.actionsTaken);
    expect(a.state.turn).toBe(b.state.turn);
  });

  it('produces different outcomes across enough distinct seeds (not hardcoded to one winner)', () => {
    const outcomes = new Set<string>();
    for (let i = 0; i < 8; i += 1) {
      const { state } = simulateMatch(`variety-seed-${i}`);
      outcomes.add(state.winnerId ?? 'draw');
    }
    expect(outcomes.size).toBeGreaterThan(1);
  });
});
