import { describe, expect, it } from 'vitest';
import { makeBareMatchState, makeContext, makeUnit } from '../test-helpers.js';
import type { GameEvent } from './types.js';
import { endTurn, startTurn } from './turn.js';

describe('startTurn', () => {
  it('sets maxEnergy/energy to the global turn number, capped at 10', () => {
    const state = makeBareMatchState({
      activePlayerId: 'p1',
      turn: 4,
      player1: { playerId: 'p1', energy: 0, maxEnergy: 0 },
      player2: { playerId: 'p2' },
    });
    const events: GameEvent[] = [];
    startTurn(state, makeContext([]), events);
    expect(state.players.p1!.energy).toBe(4);
    expect(state.players.p1!.maxEnergy).toBe(4);
  });

  it('caps energy at MAX_ENERGY (10) on later turns', () => {
    const state = makeBareMatchState({
      activePlayerId: 'p1',
      turn: 15,
      player1: { playerId: 'p1' },
      player2: { playerId: 'p2' },
    });
    startTurn(state, makeContext([]), []);
    expect(state.players.p1!.maxEnergy).toBe(10);
  });

  it('does not draw on turn 1 but does draw from turn 2 onward', () => {
    const stateTurn1 = makeBareMatchState({
      activePlayerId: 'p1',
      turn: 1,
      player1: { playerId: 'p1', deck: [{ instanceId: 'c1', cardId: 'card-a' }], hand: [] },
      player2: { playerId: 'p2' },
    });
    startTurn(stateTurn1, makeContext([]), []);
    expect(stateTurn1.players.p1!.hand).toHaveLength(0);

    const stateTurn2 = makeBareMatchState({
      activePlayerId: 'p1',
      turn: 2,
      player1: { playerId: 'p1', deck: [{ instanceId: 'c1', cardId: 'card-a' }], hand: [] },
      player2: { playerId: 'p2' },
    });
    startTurn(stateTurn2, makeContext([]), []);
    expect(stateTurn2.players.p1!.hand).toHaveLength(1);
  });

  it('resets summonedThisTurn and attackedThisTurn on the active player board', () => {
    const unit = makeUnit({
      ownerId: 'p1',
      cardId: 'card-a',
      summonedThisTurn: true,
      attackedThisTurn: true,
    });
    const state = makeBareMatchState({
      activePlayerId: 'p1',
      turn: 2,
      player1: { playerId: 'p1', board: [unit] },
      player2: { playerId: 'p2' },
    });
    startTurn(state, makeContext([]), []);
    expect(state.players.p1!.board[0]!.summonedThisTurn).toBe(false);
    expect(state.players.p1!.board[0]!.attackedThisTurn).toBe(false);
  });
});

describe('drawCard via startTurn (fatigue)', () => {
  it('deals increasing fatigue damage once the deck is empty', () => {
    const state = makeBareMatchState({
      activePlayerId: 'p1',
      turn: 2,
      player1: { playerId: 'p1', deck: [], conductorHp: 30, fatigueDamage: 0 },
      player2: { playerId: 'p2' },
    });
    startTurn(state, makeContext([]), []);
    expect(state.players.p1!.fatigueDamage).toBe(1);
    expect(state.players.p1!.conductorHp).toBe(29);

    state.turn = 4;
    state.activePlayerId = 'p1';
    startTurn(state, makeContext([]), []);
    expect(state.players.p1!.fatigueDamage).toBe(2);
    expect(state.players.p1!.conductorHp).toBe(27);
  });

  it('finishes the match if fatigue brings a Conductor to 0 HP', () => {
    const state = makeBareMatchState({
      activePlayerId: 'p1',
      turn: 2,
      player1: { playerId: 'p1', deck: [], conductorHp: 1, fatigueDamage: 0 },
      player2: { playerId: 'p2' },
    });
    startTurn(state, makeContext([]), []);
    expect(state.finished).toBe(true);
    expect(state.winnerId).toBe('p2');
  });
});

describe('endTurn', () => {
  it('switches the active player and advances the global turn counter', () => {
    const state = makeBareMatchState({
      activePlayerId: 'p1',
      turn: 1,
      player1: { playerId: 'p1' },
      player2: { playerId: 'p2' },
    });
    endTurn(state, makeContext([]), []);
    expect(state.activePlayerId).toBe('p2');
    expect(state.turn).toBe(2);
    expect(state.players.p2!.energy).toBe(2);
  });

  it('reverts END_OF_TURN buffs when the turn ends', () => {
    const unit = makeUnit({ ownerId: 'p1', cardId: 'card-a', attack: 5, health: 5, maxHealth: 5 });
    const state = makeBareMatchState({
      activePlayerId: 'p1',
      turn: 1,
      player1: { playerId: 'p1', board: [unit] },
      player2: { playerId: 'p2' },
    });
    state.pendingEndOfTurnReverts.push({
      unitInstanceId: unit.instanceId,
      attackDelta: 2,
      healthDelta: 0,
    });

    endTurn(state, makeContext([]), []);

    // unit now belongs to whichever player object still holds it (board array reference preserved)
    const foundUnit = state.players.p1!.board.find((u) => u.instanceId === unit.instanceId)!;
    expect(foundUnit.attack).toBe(3);
    expect(state.pendingEndOfTurnReverts).toHaveLength(0);
  });
});
