import { describe, expect, it } from 'vitest';
import { makeBareMatchState, makeCharacter, makeContext, makeUnit } from '../test-helpers.js';
import { chooseBotAction } from './pve-bot.js';

describe('chooseBotAction — NORMAL/HARD heuristics', () => {
  it('goes for lethal when a ready attacker can end the match', () => {
    const attacker = makeUnit({ ownerId: 'bot', cardId: 'a', attack: 10 });
    const state = makeBareMatchState({
      activePlayerId: 'bot',
      player1: { playerId: 'bot', board: [attacker] },
      player2: { playerId: 'human', conductorHp: 5 },
    });
    const action = chooseBotAction(state, makeContext([]), 'bot', 'NORMAL');
    expect(action).toEqual({
      type: 'ATTACK',
      playerId: 'bot',
      attackerId: attacker.instanceId,
      targetId: 'human',
    });
  });

  it('takes a favourable trade over attacking the face', () => {
    const attacker = makeUnit({ ownerId: 'bot', cardId: 'a', attack: 4, health: 4, maxHealth: 4 });
    const weakEnemy = makeUnit({
      ownerId: 'human',
      cardId: 'e',
      attack: 1,
      health: 2,
      maxHealth: 2,
    });
    const state = makeBareMatchState({
      activePlayerId: 'bot',
      player1: { playerId: 'bot', board: [attacker] },
      player2: { playerId: 'human', board: [weakEnemy], conductorHp: 30 },
    });
    const action = chooseBotAction(state, makeContext([]), 'bot', 'NORMAL');
    expect(action).toEqual({
      type: 'ATTACK',
      playerId: 'bot',
      attackerId: attacker.instanceId,
      targetId: weakEnemy.instanceId,
    });
  });

  it('avoids an unsafe trade on NORMAL but takes it on HARD when it removes a bigger threat', () => {
    const attacker = makeUnit({ ownerId: 'bot', cardId: 'a', attack: 5, health: 1, maxHealth: 1 });
    const bigEnemy = makeUnit({
      ownerId: 'human',
      cardId: 'e',
      attack: 5,
      health: 5,
      maxHealth: 5,
    });
    const state = makeBareMatchState({
      activePlayerId: 'bot',
      player1: { playerId: 'bot', board: [attacker] },
      player2: { playerId: 'human', board: [bigEnemy], conductorHp: 30 },
    });

    // NORMAL declines the unsafe trade and falls back to attacking the Conductor instead.
    const normal = chooseBotAction(state, makeContext([]), 'bot', 'NORMAL');
    expect(normal).toEqual({
      type: 'ATTACK',
      playerId: 'bot',
      attackerId: attacker.instanceId,
      targetId: 'human',
    });

    const hard = chooseBotAction(state, makeContext([]), 'bot', 'HARD');
    expect(hard).toEqual({
      type: 'ATTACK',
      playerId: 'bot',
      attackerId: attacker.instanceId,
      targetId: bigEnemy.instanceId,
    });
  });

  it('plays the highest-cost affordable card when no attacks are available', () => {
    const cheap = makeCharacter({ id: 'cheap', cost: 1 });
    const expensive = makeCharacter({ id: 'expensive', cost: 3 });
    const state = makeBareMatchState({
      activePlayerId: 'bot',
      player1: {
        playerId: 'bot',
        energy: 3,
        hand: [
          { instanceId: 'h1', cardId: cheap.id },
          { instanceId: 'h2', cardId: expensive.id },
        ],
      },
      player2: { playerId: 'human' },
    });

    const action = chooseBotAction(state, makeContext([cheap, expensive]), 'bot', 'NORMAL');
    expect(action).toEqual({
      type: 'PLAY_CARD',
      playerId: 'bot',
      cardId: 'h2',
      targetId: undefined,
    });
  });

  it('attacks the face as a fallback when nothing else is available', () => {
    const attacker = makeUnit({ ownerId: 'bot', cardId: 'a', attack: 2 });
    const state = makeBareMatchState({
      activePlayerId: 'bot',
      player1: { playerId: 'bot', board: [attacker], hand: [], energy: 0 },
      player2: { playerId: 'human', conductorHp: 30 },
    });
    const action = chooseBotAction(state, makeContext([]), 'bot', 'NORMAL');
    expect(action).toEqual({
      type: 'ATTACK',
      playerId: 'bot',
      attackerId: attacker.instanceId,
      targetId: 'human',
    });
  });

  it('ends the turn when there is nothing legal left to do', () => {
    const state = makeBareMatchState({
      activePlayerId: 'bot',
      player1: { playerId: 'bot', board: [], hand: [], energy: 0 },
      player2: { playerId: 'human' },
    });
    const action = chooseBotAction(state, makeContext([]), 'bot', 'NORMAL');
    expect(action).toEqual({ type: 'END_TURN', playerId: 'bot' });
  });
});

describe('chooseBotAction — EASY difficulty', () => {
  it('always returns a structurally legal action shape even when random', () => {
    const attacker = makeUnit({ ownerId: 'bot', cardId: 'a', attack: 2 });
    const card = makeCharacter({ id: 'x', cost: 1 });
    const state = makeBareMatchState({
      activePlayerId: 'bot',
      player1: {
        playerId: 'bot',
        board: [attacker],
        energy: 2,
        hand: [{ instanceId: 'h1', cardId: card.id }],
      },
      player2: { playerId: 'human' },
    });
    const action = chooseBotAction(state, makeContext([card]), 'bot', 'EASY');
    expect(['PLAY_CARD', 'ATTACK', 'END_TURN']).toContain(action.type);
    expect(action.playerId).toBe('bot');
  });
});
