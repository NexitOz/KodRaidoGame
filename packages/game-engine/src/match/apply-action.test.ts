import { describe, expect, it } from 'vitest';
import {
  makeBareMatchState,
  makeCharacter,
  makeContext,
  makeRune,
  makeTrack,
  makeUnit,
} from '../test-helpers.js';
import { applyAction } from './apply-action.js';

describe('applyAction — validation', () => {
  it('rejects actions from a player whose turn it is not', () => {
    const state = makeBareMatchState({
      activePlayerId: 'p1',
      player1: { playerId: 'p1' },
      player2: { playerId: 'p2' },
    });
    const result = applyAction(state, { type: 'END_TURN', playerId: 'p2' }, makeContext([]));
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/turn/i);
  });

  it('does not mutate the original state object (pure function contract)', () => {
    const state = makeBareMatchState({
      activePlayerId: 'p1',
      player1: { playerId: 'p1' },
      player2: { playerId: 'p2' },
    });
    const originalTurn = state.turn;
    const result = applyAction(state, { type: 'END_TURN', playerId: 'p1' }, makeContext([]));
    expect(state.turn).toBe(originalTurn);
    expect(result.state).not.toBe(state);
  });
});

describe('applyAction — PLAY_CARD', () => {
  it('rejects a play when the player cannot afford the cost', () => {
    const card = makeCharacter({ cost: 5 });
    const state = makeBareMatchState({
      activePlayerId: 'p1',
      player1: { playerId: 'p1', energy: 2, hand: [{ instanceId: 'hand-1', cardId: card.id }] },
      player2: { playerId: 'p2' },
    });
    const result = applyAction(
      state,
      { type: 'PLAY_CARD', playerId: 'p1', cardId: 'hand-1' },
      makeContext([card]),
    );
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/energy/i);
  });

  it('rejects playing a Character when the board is already full', () => {
    const card = makeCharacter({ cost: 1 });
    const board = [1, 2, 3, 4, 5].map(() => makeUnit({ ownerId: 'p1', cardId: 'filler' }));
    const state = makeBareMatchState({
      activePlayerId: 'p1',
      player1: {
        playerId: 'p1',
        energy: 5,
        board,
        hand: [{ instanceId: 'hand-1', cardId: card.id }],
      },
      player2: { playerId: 'p2' },
    });
    const result = applyAction(
      state,
      { type: 'PLAY_CARD', playerId: 'p1', cardId: 'hand-1' },
      makeContext([card]),
    );
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/board/i);
  });

  it('summons a Character onto the board, applying the Resonance boost snapshot', () => {
    const card = makeCharacter({ cost: 2, attack: 4, health: 4 });
    const state = makeBareMatchState({
      activePlayerId: 'p1',
      player1: { playerId: 'p1', energy: 3, hand: [{ instanceId: 'hand-1', cardId: card.id }] },
      player2: { playerId: 'p2' },
    });
    state.boostSnapshot = [{ cardId: card.id, tier: 5, boostPercent: 10 }];

    const result = applyAction(
      state,
      { type: 'PLAY_CARD', playerId: 'p1', cardId: 'hand-1' },
      makeContext([card]),
    );

    expect(result.valid).toBe(true);
    expect(result.state.players.p1!.energy).toBe(1);
    expect(result.state.players.p1!.hand).toHaveLength(0);
    expect(result.state.players.p1!.board).toHaveLength(1);
    expect(result.state.players.p1!.board[0]!.attack).toBe(4); // round(4 * 1.10) = 4.4 -> 4
    expect(result.state.players.p1!.board[0]!.health).toBe(4);
  });

  it('activates a Rune permanently instead of putting it on the board', () => {
    const rune = makeRune({ cost: 1 });
    const state = makeBareMatchState({
      activePlayerId: 'p1',
      player1: { playerId: 'p1', energy: 1, hand: [{ instanceId: 'hand-1', cardId: rune.id }] },
      player2: { playerId: 'p2' },
    });

    const result = applyAction(
      state,
      { type: 'PLAY_CARD', playerId: 'p1', cardId: 'hand-1' },
      makeContext([rune]),
    );

    expect(result.valid).toBe(true);
    expect(result.state.players.p1!.runes).toContain(rune.id);
    expect(result.state.players.p1!.board).toHaveLength(0);
  });

  it('applies an active COST_MODIFIER rune once, then reverts to the base cost', () => {
    const shadowCard = makeCharacter({ cost: 3, tags: ['Shadow'] });
    const state = makeBareMatchState({
      activePlayerId: 'p1',
      player1: {
        playerId: 'p1',
        energy: 2,
        turnCostModifiers: [{ tagFilter: 'Shadow', amount: -1, usesRemaining: 1 }],
        hand: [
          { instanceId: 'hand-1', cardId: shadowCard.id },
          { instanceId: 'hand-2', cardId: shadowCard.id },
        ],
      },
      player2: { playerId: 'p2' },
    });

    const first = applyAction(
      state,
      { type: 'PLAY_CARD', playerId: 'p1', cardId: 'hand-1' },
      makeContext([shadowCard]),
    );
    expect(first.valid).toBe(true);
    expect(first.state.players.p1!.energy).toBe(0); // paid 2 (3 - 1 discount)

    const second = applyAction(
      first.state,
      { type: 'PLAY_CARD', playerId: 'p1', cardId: 'hand-2' },
      makeContext([shadowCard]),
    );
    expect(second.valid).toBe(false); // discount already used, full cost of 3 > 0 energy left
  });

  it('records the last played Track effect for REPEAT_LAST_TRACK, but not for a self-echoing track', () => {
    const track = makeTrack({
      id: 'a-track',
      effects: [
        {
          trigger: 'ON_TRACK_PLAYED',
          conditions: [],
          effects: [{ type: 'DRAW', amount: 1 }],
        },
      ],
    });
    const state = makeBareMatchState({
      activePlayerId: 'p1',
      player1: { playerId: 'p1', energy: 5, hand: [{ instanceId: 'hand-1', cardId: track.id }] },
      player2: { playerId: 'p2' },
    });

    const result = applyAction(
      state,
      { type: 'PLAY_CARD', playerId: 'p1', cardId: 'hand-1' },
      makeContext([track]),
    );

    expect(result.valid).toBe(true);
    expect(result.state.lastTrackEffect.p1?.cardId).toBe('a-track');
  });
});

describe('applyAction — ATTACK', () => {
  it('rejects attacking with a unit that has summoning sickness', () => {
    const attacker = makeUnit({ ownerId: 'p1', cardId: 'a', summonedThisTurn: true });
    const state = makeBareMatchState({
      activePlayerId: 'p1',
      player1: { playerId: 'p1', board: [attacker] },
      player2: { playerId: 'p2' },
    });
    const result = applyAction(
      state,
      { type: 'ATTACK', playerId: 'p1', attackerId: attacker.instanceId, targetId: 'p2' },
      makeContext([]),
    );
    expect(result.valid).toBe(false);
  });

  it('allows a unit with IMPULSE to attack the turn it was summoned', () => {
    const attacker = makeUnit({
      ownerId: 'p1',
      cardId: 'a',
      summonedThisTurn: true,
      statuses: ['IMPULSE'],
      attack: 3,
    });
    const state = makeBareMatchState({
      activePlayerId: 'p1',
      player1: { playerId: 'p1', board: [attacker] },
      player2: { playerId: 'p2', conductorHp: 30 },
    });
    const result = applyAction(
      state,
      { type: 'ATTACK', playerId: 'p1', attackerId: attacker.instanceId, targetId: 'p2' },
      makeContext([]),
    );
    expect(result.valid).toBe(true);
    expect(result.state.players.p2!.conductorHp).toBe(27);
  });

  it('rejects a second attack from the same unit in one turn', () => {
    const attacker = makeUnit({ ownerId: 'p1', cardId: 'a', attackedThisTurn: true });
    const state = makeBareMatchState({
      activePlayerId: 'p1',
      player1: { playerId: 'p1', board: [attacker] },
      player2: { playerId: 'p2' },
    });
    const result = applyAction(
      state,
      { type: 'ATTACK', playerId: 'p1', attackerId: attacker.instanceId, targetId: 'p2' },
      makeContext([]),
    );
    expect(result.valid).toBe(false);
  });

  it('rejects attacking with a CURSEd unit', () => {
    const attacker = makeUnit({ ownerId: 'p1', cardId: 'a', statuses: ['CURSE'] });
    const state = makeBareMatchState({
      activePlayerId: 'p1',
      player1: { playerId: 'p1', board: [attacker] },
      player2: { playerId: 'p2' },
    });
    const result = applyAction(
      state,
      { type: 'ATTACK', playerId: 'p1', attackerId: attacker.instanceId, targetId: 'p2' },
      makeContext([]),
    );
    expect(result.valid).toBe(false);
  });

  it('rejects targeting a unit with the HIDDEN status', () => {
    const attacker = makeUnit({ ownerId: 'p1', cardId: 'a' });
    const hidden = makeUnit({ ownerId: 'p2', cardId: 'b', statuses: ['HIDDEN'] });
    const state = makeBareMatchState({
      activePlayerId: 'p1',
      player1: { playerId: 'p1', board: [attacker] },
      player2: { playerId: 'p2', board: [hidden] },
    });
    const result = applyAction(
      state,
      {
        type: 'ATTACK',
        playerId: 'p1',
        attackerId: attacker.instanceId,
        targetId: hidden.instanceId,
      },
      makeContext([]),
    );
    expect(result.valid).toBe(false);
  });
});

describe('applyAction — END_TURN', () => {
  it('passes the turn to the opponent and ramps energy', () => {
    const state = makeBareMatchState({
      activePlayerId: 'p1',
      turn: 1,
      player1: { playerId: 'p1' },
      player2: { playerId: 'p2' },
    });
    const result = applyAction(state, { type: 'END_TURN', playerId: 'p1' }, makeContext([]));
    expect(result.valid).toBe(true);
    expect(result.state.activePlayerId).toBe('p2');
    expect(result.state.turn).toBe(2);
    expect(result.state.players.p2!.energy).toBe(2);
  });
});
