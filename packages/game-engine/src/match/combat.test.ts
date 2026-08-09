import { describe, expect, it } from 'vitest';
import { makeBareMatchState, makeContext, makeUnit } from '../test-helpers.js';
import { resolveAttack } from './combat.js';

describe('resolveAttack', () => {
  it('deals simultaneous damage when a unit attacks another unit', () => {
    const attacker = makeUnit({ ownerId: 'p1', cardId: 'a', attack: 3, health: 4, maxHealth: 4 });
    const defender = makeUnit({ ownerId: 'p2', cardId: 'b', attack: 2, health: 5, maxHealth: 5 });
    const state = makeBareMatchState({
      activePlayerId: 'p1',
      player1: { playerId: 'p1', board: [attacker] },
      player2: { playerId: 'p2', board: [defender] },
    });

    resolveAttack(state, makeContext([]), 'p1', attacker.instanceId, defender.instanceId, []);

    expect(state.players.p2!.board[0]!.health).toBe(2); // 5 - 3
    expect(state.players.p1!.board[0]!.health).toBe(2); // 4 - 2
  });

  it('kills both units in an even trade', () => {
    const attacker = makeUnit({ ownerId: 'p1', cardId: 'a', attack: 3, health: 3, maxHealth: 3 });
    const defender = makeUnit({ ownerId: 'p2', cardId: 'b', attack: 3, health: 3, maxHealth: 3 });
    const state = makeBareMatchState({
      activePlayerId: 'p1',
      player1: { playerId: 'p1', board: [attacker] },
      player2: { playerId: 'p2', board: [defender] },
    });

    resolveAttack(state, makeContext([]), 'p1', attacker.instanceId, defender.instanceId, []);

    expect(state.players.p1!.board).toHaveLength(0);
    expect(state.players.p2!.board).toHaveLength(0);
  });

  it('damages the Conductor directly when attacking the opposing player', () => {
    const attacker = makeUnit({ ownerId: 'p1', cardId: 'a', attack: 5, health: 4, maxHealth: 4 });
    const state = makeBareMatchState({
      activePlayerId: 'p1',
      player1: { playerId: 'p1', board: [attacker] },
      player2: { playerId: 'p2', conductorHp: 30 },
    });

    resolveAttack(state, makeContext([]), 'p1', attacker.instanceId, 'p2', []);

    expect(state.players.p2!.conductorHp).toBe(25);
  });

  it('consumes SHIELD instead of taking damage, and the shield only blocks once', () => {
    const attacker = makeUnit({ ownerId: 'p1', cardId: 'a', attack: 4, health: 4, maxHealth: 4 });
    const defender = makeUnit({
      ownerId: 'p2',
      cardId: 'b',
      attack: 1,
      health: 5,
      maxHealth: 5,
      statuses: ['SHIELD'],
    });
    const state = makeBareMatchState({
      activePlayerId: 'p1',
      player1: { playerId: 'p1', board: [attacker] },
      player2: { playerId: 'p2', board: [defender] },
    });

    resolveAttack(state, makeContext([]), 'p1', attacker.instanceId, defender.instanceId, []);

    expect(state.players.p2!.board[0]!.health).toBe(5);
    expect(state.players.p2!.board[0]!.statuses).not.toContain('SHIELD');
  });

  it('fires a deathrattle (ON_DEATH self-effect) when the dying unit has one', async () => {
    const { makeCharacter } = await import('../test-helpers.js');
    const dyingCard = makeCharacter({
      id: 'dying-card',
      attack: 1,
      health: 1,
      effects: [
        {
          trigger: 'ON_DEATH',
          conditions: [],
          effects: [{ type: 'DAMAGE', target: 'ENEMY_CONDUCTOR', amount: 3 }],
        },
      ],
    });
    const attacker = makeUnit({
      ownerId: 'p2',
      cardId: 'attacker',
      attack: 5,
      health: 5,
      maxHealth: 5,
    });
    const dying = makeUnit({
      ownerId: 'p1',
      cardId: dyingCard.id,
      attack: 1,
      health: 1,
      maxHealth: 1,
    });
    const state = makeBareMatchState({
      activePlayerId: 'p2',
      player1: { playerId: 'p1', board: [dying], conductorHp: 30 },
      player2: { playerId: 'p2', board: [attacker], conductorHp: 30 },
    });

    resolveAttack(state, makeContext([dyingCard]), 'p2', attacker.instanceId, dying.instanceId, []);

    expect(state.players.p1!.board).toHaveLength(0);
    expect(state.players.p2!.conductorHp).toBe(27);
  });
});
