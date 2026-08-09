import { describe, expect, it } from 'vitest';
import { createMatch } from './match-setup.js';

function deckOf(cardId: string, quantity: number) {
  return [{ cardId, quantity }];
}

describe('createMatch', () => {
  it('deals 3 starting cards to player one and 4 (3 + compensation) to player two', () => {
    const state = createMatch({
      matchId: 'm1',
      seed: 'setup-seed',
      rulesVersion: 'v1',
      player1: { playerId: 'p1', deck: deckOf('card-a', 20) },
      player2: { playerId: 'p2', deck: deckOf('card-a', 20) },
    });

    const secondPlayerId = Object.keys(state.players).find((id) => id !== state.activePlayerId)!;
    expect(state.players[state.activePlayerId]!.hand).toHaveLength(3);
    expect(state.players[secondPlayerId]!.hand).toHaveLength(4);
  });

  it('gives the active player 1 energy on turn 1 and leaves the other player at 0 until their turn', () => {
    const state = createMatch({
      matchId: 'm1',
      seed: 'energy-seed',
      rulesVersion: 'v1',
      player1: { playerId: 'p1', deck: deckOf('card-a', 20) },
      player2: { playerId: 'p2', deck: deckOf('card-a', 20) },
    });
    const inactivePlayerId = Object.keys(state.players).find((id) => id !== state.activePlayerId)!;

    expect(state.players[state.activePlayerId]!.energy).toBe(1);
    expect(state.players[state.activePlayerId]!.maxEnergy).toBe(1);
    expect(state.players[inactivePlayerId]!.energy).toBe(0);
  });

  it('is fully deterministic for a fixed seed (dealing, shuffling, and who goes first)', () => {
    const build = () =>
      createMatch({
        matchId: 'm1',
        seed: 'deterministic-seed',
        rulesVersion: 'v1',
        player1: { playerId: 'p1', deck: deckOf('card-a', 15).concat(deckOf('card-b', 15)) },
        player2: { playerId: 'p2', deck: deckOf('card-a', 15).concat(deckOf('card-b', 15)) },
      });

    const a = build();
    const b = build();
    expect(a.activePlayerId).toBe(b.activePlayerId);
    expect(a.players.p1!.hand.map((c) => c.cardId)).toEqual(
      b.players.p1!.hand.map((c) => c.cardId),
    );
    expect(a.players.p1!.deck.map((c) => c.cardId)).toEqual(
      b.players.p1!.deck.map((c) => c.cardId),
    );
  });

  it('gives both players 30 HP and starts on turn 1', () => {
    const state = createMatch({
      matchId: 'm1',
      seed: 'hp-seed',
      rulesVersion: 'v1',
      player1: { playerId: 'p1', deck: deckOf('card-a', 20) },
      player2: { playerId: 'p2', deck: deckOf('card-a', 20) },
    });
    expect(state.players.p1!.conductorHp).toBe(30);
    expect(state.players.p2!.conductorHp).toBe(30);
    expect(state.turn).toBe(1);
    expect(state.finished).toBe(false);
  });
});
