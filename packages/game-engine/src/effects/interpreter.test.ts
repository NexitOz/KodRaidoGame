import { describe, expect, it } from 'vitest';
import { makeBareMatchState, makeContext, makeUnit } from '../test-helpers.js';
import { runEffects } from './interpreter.js';

describe('runEffects — DAMAGE / HEAL', () => {
  it('DAMAGE reduces the target unit health', async () => {
    const { makeCharacter } = await import('../test-helpers.js');
    const card = makeCharacter({
      id: 'nuker',
      effects: [
        {
          trigger: 'ON_PLAY',
          conditions: [],
          effects: [{ type: 'DAMAGE', target: 'ENEMY_CHOSEN', amount: 3 }],
        },
      ],
    });
    const target = makeUnit({ ownerId: 'p2', cardId: 'target', health: 5, maxHealth: 5 });
    const state = makeBareMatchState({
      activePlayerId: 'p1',
      player1: { playerId: 'p1' },
      player2: { playerId: 'p2', board: [target] },
    });

    runEffects({
      state,
      matchCtx: makeContext([card]),
      trigger: 'ON_PLAY',
      ownerId: 'p1',
      sourceCardId: card.id,
      explicitTargetId: target.instanceId,
      events: [],
    });

    expect(state.players.p2!.board[0]!.health).toBe(2);
  });

  it('HEAL clamps to the Conductor starting max HP (30)', async () => {
    const { makeCharacter } = await import('../test-helpers.js');
    const card = makeCharacter({
      id: 'healer',
      effects: [
        {
          trigger: 'ON_PLAY',
          conditions: [],
          effects: [{ type: 'HEAL', target: 'FRIENDLY_CONDUCTOR', amount: 10 }],
        },
      ],
    });
    const state = makeBareMatchState({
      activePlayerId: 'p1',
      player1: { playerId: 'p1', conductorHp: 25 },
      player2: { playerId: 'p2' },
    });

    runEffects({
      state,
      matchCtx: makeContext([card]),
      trigger: 'ON_PLAY',
      ownerId: 'p1',
      sourceCardId: card.id,
      events: [],
    });

    expect(state.players.p1!.conductorHp).toBe(30);
  });
});

describe('runEffects — BUFF / DEBUFF', () => {
  it('BUFF with END_OF_TURN duration is tracked for reverting later', async () => {
    const { makeCharacter } = await import('../test-helpers.js');
    const unit = makeUnit({ ownerId: 'p1', cardId: 'buffed', attack: 2, health: 2, maxHealth: 2 });
    const card = makeCharacter({
      id: 'buffer',
      effects: [
        {
          trigger: 'ON_PLAY',
          conditions: [],
          effects: [
            { type: 'BUFF', target: 'SELF', attack: 2, health: 1, duration: 'END_OF_TURN' },
          ],
        },
      ],
    });
    const state = makeBareMatchState({
      activePlayerId: 'p1',
      player1: { playerId: 'p1', board: [unit] },
      player2: { playerId: 'p2' },
    });

    runEffects({
      state,
      matchCtx: makeContext([card]),
      trigger: 'ON_PLAY',
      ownerId: 'p1',
      sourceCardId: card.id,
      sourceInstanceId: unit.instanceId,
      events: [],
    });

    expect(state.players.p1!.board[0]!.attack).toBe(4);
    expect(state.players.p1!.board[0]!.health).toBe(3);
    expect(state.pendingEndOfTurnReverts).toHaveLength(1);
  });

  it('DEBUFF can reduce a unit to 0 health and trigger death cleanup', async () => {
    const { makeCharacter } = await import('../test-helpers.js');
    const victim = makeUnit({
      ownerId: 'p2',
      cardId: 'victim',
      attack: 1,
      health: 1,
      maxHealth: 1,
    });
    const card = makeCharacter({
      id: 'debuffer',
      effects: [
        {
          trigger: 'ON_PLAY',
          conditions: [],
          effects: [
            { type: 'DEBUFF', target: 'ENEMY_CHOSEN', attack: 0, health: 1, duration: 'PERMANENT' },
          ],
        },
      ],
    });
    const state = makeBareMatchState({
      activePlayerId: 'p1',
      player1: { playerId: 'p1' },
      player2: { playerId: 'p2', board: [victim] },
    });

    runEffects({
      state,
      matchCtx: makeContext([card]),
      trigger: 'ON_PLAY',
      ownerId: 'p1',
      sourceCardId: card.id,
      explicitTargetId: victim.instanceId,
      events: [],
    });

    expect(state.players.p2!.board).toHaveLength(0);
  });
});

describe('runEffects — DRAW / SHIELD / SILENCE / ADD_STATUS / GAIN_ENERGY', () => {
  it('DRAW moves a card from deck to hand', async () => {
    const { makeCharacter } = await import('../test-helpers.js');
    const card = makeCharacter({
      id: 'drawer',
      effects: [{ trigger: 'ON_PLAY', conditions: [], effects: [{ type: 'DRAW', amount: 2 }] }],
    });
    const state = makeBareMatchState({
      activePlayerId: 'p1',
      player1: {
        playerId: 'p1',
        deck: [
          { instanceId: 'd1', cardId: 'x' },
          { instanceId: 'd2', cardId: 'x' },
        ],
      },
      player2: { playerId: 'p2' },
    });

    runEffects({
      state,
      matchCtx: makeContext([card]),
      trigger: 'ON_PLAY',
      ownerId: 'p1',
      sourceCardId: card.id,
      events: [],
    });

    expect(state.players.p1!.hand).toHaveLength(2);
    expect(state.players.p1!.deck).toHaveLength(0);
  });

  it('SHIELD adds the SHIELD status once (no duplicates)', async () => {
    const { makeCharacter } = await import('../test-helpers.js');
    const unit = makeUnit({ ownerId: 'p1', cardId: 'shielded' });
    const card = makeCharacter({
      id: 'protector',
      effects: [
        { trigger: 'ON_PLAY', conditions: [], effects: [{ type: 'SHIELD', target: 'SELF' }] },
      ],
    });
    const state = makeBareMatchState({
      activePlayerId: 'p1',
      player1: { playerId: 'p1', board: [unit] },
      player2: { playerId: 'p2' },
    });

    runEffects({
      state,
      matchCtx: makeContext([card]),
      trigger: 'ON_PLAY',
      ownerId: 'p1',
      sourceCardId: card.id,
      sourceInstanceId: unit.instanceId,
      events: [],
    });
    runEffects({
      state,
      matchCtx: makeContext([card]),
      trigger: 'ON_PLAY',
      ownerId: 'p1',
      sourceCardId: card.id,
      sourceInstanceId: unit.instanceId,
      events: [],
    });

    expect(state.players.p1!.board[0]!.statuses).toEqual(['SHIELD']);
  });

  it('SILENCE adds the SILENCED status to the target', async () => {
    const { makeCharacter } = await import('../test-helpers.js');
    const target = makeUnit({ ownerId: 'p2', cardId: 'silenced-target' });
    const card = makeCharacter({
      id: 'silencer',
      effects: [
        {
          trigger: 'ON_PLAY',
          conditions: [],
          effects: [{ type: 'SILENCE', target: 'ENEMY_CHOSEN' }],
        },
      ],
    });
    const state = makeBareMatchState({
      activePlayerId: 'p1',
      player1: { playerId: 'p1' },
      player2: { playerId: 'p2', board: [target] },
    });

    runEffects({
      state,
      matchCtx: makeContext([card]),
      trigger: 'ON_PLAY',
      ownerId: 'p1',
      sourceCardId: card.id,
      explicitTargetId: target.instanceId,
      events: [],
    });

    expect(state.players.p2!.board[0]!.statuses).toContain('SILENCED');
  });

  it('GAIN_ENERGY increases the owning player energy immediately', async () => {
    const { makeCharacter } = await import('../test-helpers.js');
    const card = makeCharacter({
      id: 'energizer',
      effects: [
        { trigger: 'ON_PLAY', conditions: [], effects: [{ type: 'GAIN_ENERGY', amount: 2 }] },
      ],
    });
    const state = makeBareMatchState({
      activePlayerId: 'p1',
      player1: { playerId: 'p1', energy: 1 },
      player2: { playerId: 'p2' },
    });

    runEffects({
      state,
      matchCtx: makeContext([card]),
      trigger: 'ON_PLAY',
      ownerId: 'p1',
      sourceCardId: card.id,
      events: [],
    });

    expect(state.players.p1!.energy).toBe(3);
  });
});

describe('runEffects — SUMMON / DESTROY', () => {
  it('SUMMON creates a token unit from a card slug on the owner board', async () => {
    const { makeCharacter } = await import('../test-helpers.js');
    const token = makeCharacter({ id: 'token-id', slug: 'shadow-token', attack: 2, health: 1 });
    const card = makeCharacter({
      id: 'summoner',
      effects: [
        {
          trigger: 'ON_PLAY',
          conditions: [],
          effects: [{ type: 'SUMMON', summonCardSlug: 'shadow-token', amount: 2 }],
        },
      ],
    });
    const state = makeBareMatchState({
      activePlayerId: 'p1',
      player1: { playerId: 'p1' },
      player2: { playerId: 'p2' },
    });

    runEffects({
      state,
      matchCtx: makeContext([card, token]),
      trigger: 'ON_PLAY',
      ownerId: 'p1',
      sourceCardId: card.id,
      events: [],
    });

    expect(state.players.p1!.board).toHaveLength(2);
    expect(state.players.p1!.board[0]!.cardId).toBe('token-id');
  });

  it('SUMMON stops once the board reaches MAX_BOARD_UNITS', async () => {
    const { makeCharacter } = await import('../test-helpers.js');
    const token = makeCharacter({ id: 'token-id', slug: 'filler', attack: 1, health: 1 });
    const card = makeCharacter({
      id: 'summoner',
      effects: [
        {
          trigger: 'ON_PLAY',
          conditions: [],
          effects: [{ type: 'SUMMON', summonCardSlug: 'filler', amount: 3 }],
        },
      ],
    });
    const existing = [1, 2, 3, 4].map(() => makeUnit({ ownerId: 'p1', cardId: 'filler' }));
    const state = makeBareMatchState({
      activePlayerId: 'p1',
      player1: { playerId: 'p1', board: existing },
      player2: { playerId: 'p2' },
    });

    runEffects({
      state,
      matchCtx: makeContext([card, token]),
      trigger: 'ON_PLAY',
      ownerId: 'p1',
      sourceCardId: card.id,
      events: [],
    });

    expect(state.players.p1!.board).toHaveLength(5);
  });

  it('DESTROY kills a unit outright, bypassing SHIELD', async () => {
    const { makeCharacter } = await import('../test-helpers.js');
    const target = makeUnit({ ownerId: 'p2', cardId: 'x', statuses: ['SHIELD'] });
    const card = makeCharacter({
      id: 'destroyer',
      effects: [
        {
          trigger: 'ON_PLAY',
          conditions: [],
          effects: [{ type: 'DESTROY', target: 'ENEMY_CHOSEN' }],
        },
      ],
    });
    const state = makeBareMatchState({
      activePlayerId: 'p1',
      player1: { playerId: 'p1' },
      player2: { playerId: 'p2', board: [target] },
    });

    runEffects({
      state,
      matchCtx: makeContext([card]),
      trigger: 'ON_PLAY',
      ownerId: 'p1',
      sourceCardId: card.id,
      explicitTargetId: target.instanceId,
      events: [],
    });

    expect(state.players.p2!.board).toHaveLength(0);
  });
});

describe('runEffects — conditions', () => {
  it('HAS_TAG_ON_BOARD excludes the just-played unit itself', async () => {
    const { makeCharacter } = await import('../test-helpers.js');
    const card = makeCharacter({
      id: 'shadow-synergy',
      tags: ['Shadow'],
      effects: [
        {
          trigger: 'ON_PLAY',
          conditions: [{ type: 'HAS_TAG_ON_BOARD', value: 'Shadow' }],
          effects: [
            { type: 'BUFF', target: 'SELF', attack: 1, health: 0, duration: 'END_OF_TURN' },
          ],
        },
      ],
    });
    const unit = makeUnit({ ownerId: 'p1', cardId: card.id, attack: 2, health: 2, maxHealth: 2 });
    const state = makeBareMatchState({
      activePlayerId: 'p1',
      player1: { playerId: 'p1', board: [unit] },
      player2: { playerId: 'p2' },
    });

    runEffects({
      state,
      matchCtx: makeContext([card]),
      trigger: 'ON_PLAY',
      ownerId: 'p1',
      sourceCardId: card.id,
      sourceInstanceId: unit.instanceId,
      events: [],
    });

    expect(state.players.p1!.board[0]!.attack).toBe(2); // condition false: no other Shadow unit
  });

  it('ONCE_PER_TURN allows exactly one execution per turn', async () => {
    const { makeCharacter } = await import('../test-helpers.js');
    const card = makeCharacter({
      id: 'once-per-turn-card',
      effects: [
        {
          trigger: 'ON_PLAY',
          conditions: [{ type: 'ONCE_PER_TURN' }],
          effects: [{ type: 'GAIN_ENERGY', amount: 1 }],
        },
      ],
    });
    const state = makeBareMatchState({
      activePlayerId: 'p1',
      player1: { playerId: 'p1', energy: 0 },
      player2: { playerId: 'p2' },
    });

    runEffects({
      state,
      matchCtx: makeContext([card]),
      trigger: 'ON_PLAY',
      ownerId: 'p1',
      sourceCardId: card.id,
      events: [],
    });
    runEffects({
      state,
      matchCtx: makeContext([card]),
      trigger: 'ON_PLAY',
      ownerId: 'p1',
      sourceCardId: card.id,
      events: [],
    });

    expect(state.players.p1!.energy).toBe(1);
  });

  it('RESONANCE_TIER_AT_LEAST checks the fixed match boost snapshot', async () => {
    const { makeCharacter } = await import('../test-helpers.js');
    const card = makeCharacter({
      id: 'resonant-card',
      effects: [
        {
          trigger: 'ON_PLAY',
          conditions: [{ type: 'RESONANCE_TIER_AT_LEAST', value: 3 }],
          effects: [{ type: 'GAIN_ENERGY', amount: 1 }],
        },
      ],
    });
    const state = makeBareMatchState({
      activePlayerId: 'p1',
      player1: { playerId: 'p1', energy: 0 },
      player2: { playerId: 'p2' },
    });
    state.boostSnapshot = [{ cardId: card.id, tier: 2, boostPercent: 4 }];

    runEffects({
      state,
      matchCtx: makeContext([card]),
      trigger: 'ON_PLAY',
      ownerId: 'p1',
      sourceCardId: card.id,
      events: [],
    });
    expect(state.players.p1!.energy).toBe(0);

    state.boostSnapshot = [{ cardId: card.id, tier: 4, boostPercent: 8 }];
    runEffects({
      state,
      matchCtx: makeContext([card]),
      trigger: 'ON_PLAY',
      ownerId: 'p1',
      sourceCardId: card.id,
      events: [],
    });
    expect(state.players.p1!.energy).toBe(1);
  });
});

describe('runEffects — ON_DEATH / ON_HEAL rune broadcasts (Content Pack 01)', () => {
  it('broadcasts ON_DEATH to runes for ANY ally death, not just the dying unit itself', async () => {
    const { makeCharacter, makeRune } = await import('../test-helpers.js');
    const { processDeaths } = await import('./interpreter.js');
    const rune = makeRune({
      id: 'death-rune',
      effects: [
        {
          trigger: 'ON_DEATH',
          conditions: [],
          effects: [{ type: 'GAIN_ENERGY', amount: 1 }],
        },
      ],
    });
    const victim = makeUnit({ ownerId: 'p1', cardId: 'victim', health: 0, maxHealth: 3 });
    const survivor = makeCharacter({ id: 'survivor' });
    const state = makeBareMatchState({
      activePlayerId: 'p1',
      player1: { playerId: 'p1', board: [victim], runes: [rune.id], energy: 0 },
      player2: { playerId: 'p2' },
    });

    processDeaths(state, makeContext([rune, survivor]), []);

    expect(state.players.p1!.energy).toBe(1);
  });

  it('broadcasts ON_HEAL to runes only when a unit actually gains health', async () => {
    const { makeCharacter, makeRune } = await import('../test-helpers.js');
    const rune = makeRune({
      id: 'heal-rune',
      effects: [
        { trigger: 'ON_HEAL', conditions: [], effects: [{ type: 'GAIN_ENERGY', amount: 1 }] },
      ],
    });
    const healer = makeCharacter({
      id: 'healer',
      effects: [
        {
          trigger: 'ON_PLAY',
          conditions: [],
          effects: [{ type: 'HEAL', target: 'FRIENDLY_CHOSEN', amount: 3 }],
        },
      ],
    });
    const fullHealth = makeUnit({ ownerId: 'p1', cardId: 'full', health: 3, maxHealth: 3 });
    const state = makeBareMatchState({
      activePlayerId: 'p1',
      player1: { playerId: 'p1', board: [fullHealth], runes: [rune.id], energy: 0 },
      player2: { playerId: 'p2' },
    });

    // Already at max health: heal is a no-op, so ON_HEAL must NOT fire.
    runEffects({
      state,
      matchCtx: makeContext([healer, rune]),
      trigger: 'ON_PLAY',
      ownerId: 'p1',
      sourceCardId: healer.id,
      explicitTargetId: fullHealth.instanceId,
      events: [],
    });
    expect(state.players.p1!.energy).toBe(0);

    fullHealth.health = 1;
    runEffects({
      state,
      matchCtx: makeContext([healer, rune]),
      trigger: 'ON_PLAY',
      ownerId: 'p1',
      sourceCardId: healer.id,
      explicitTargetId: fullHealth.instanceId,
      events: [],
    });
    expect(state.players.p1!.energy).toBe(1);
  });
});

describe('runEffects — CLEANSE', () => {
  it('removes CURSE and SILENCED by default but leaves SHIELD/HIDDEN alone', async () => {
    const { makeCharacter } = await import('../test-helpers.js');
    const target = makeUnit({
      ownerId: 'p1',
      cardId: 'cursed',
      statuses: ['CURSE', 'SILENCED', 'SHIELD'],
    });
    const card = makeCharacter({
      id: 'cleanser',
      effects: [
        { trigger: 'ON_PLAY', conditions: [], effects: [{ type: 'CLEANSE', target: 'SELF' }] },
      ],
    });
    const state = makeBareMatchState({
      activePlayerId: 'p1',
      player1: { playerId: 'p1', board: [target] },
      player2: { playerId: 'p2' },
    });

    runEffects({
      state,
      matchCtx: makeContext([card]),
      trigger: 'ON_PLAY',
      ownerId: 'p1',
      sourceCardId: card.id,
      sourceInstanceId: target.instanceId,
      events: [],
    });

    expect(state.players.p1!.board[0]!.statuses).toEqual(['SHIELD']);
  });
});

describe('runEffects — REVIVE_FROM_DISCARD', () => {
  it('revives the first matching CHARACTER from discard as a fresh unit, deterministically', async () => {
    const { makeCharacter } = await import('../test-helpers.js');
    const fallen = makeCharacter({ id: 'fallen', slug: 'fallen', attack: 4, health: 4 });
    const card = makeCharacter({
      id: 'necromancer',
      effects: [
        {
          trigger: 'ON_PLAY',
          conditions: [],
          effects: [{ type: 'REVIVE_FROM_DISCARD', amount: 1, percent: 50 }],
        },
      ],
    });
    const state = makeBareMatchState({
      activePlayerId: 'p1',
      player1: { playerId: 'p1', discard: [{ instanceId: 'd1', cardId: 'fallen' }] },
      player2: { playerId: 'p2' },
    });

    runEffects({
      state,
      matchCtx: makeContext([card, fallen]),
      trigger: 'ON_PLAY',
      ownerId: 'p1',
      sourceCardId: card.id,
      events: [],
    });

    expect(state.players.p1!.discard).toHaveLength(0);
    expect(state.players.p1!.board).toHaveLength(1);
    expect(state.players.p1!.board[0]!.cardId).toBe('fallen');
    expect(state.players.p1!.board[0]!.attack).toBe(2); // floor(4 * 50%)
    expect(state.players.p1!.board[0]!.health).toBe(2);
  });

  it('is a no-op when the board is full or discard has no matching CHARACTER', async () => {
    const { makeCharacter } = await import('../test-helpers.js');
    const card = makeCharacter({
      id: 'necromancer2',
      effects: [
        {
          trigger: 'ON_PLAY',
          conditions: [],
          effects: [{ type: 'REVIVE_FROM_DISCARD', amount: 1 }],
        },
      ],
    });
    const state = makeBareMatchState({
      activePlayerId: 'p1',
      player1: { playerId: 'p1', discard: [] },
      player2: { playerId: 'p2' },
    });

    runEffects({
      state,
      matchCtx: makeContext([card]),
      trigger: 'ON_PLAY',
      ownerId: 'p1',
      sourceCardId: card.id,
      events: [],
    });

    expect(state.players.p1!.board).toHaveLength(0);
  });
});

describe('runEffects — REORDER_TOP', () => {
  it('moves the first tag-matching card within the scan window to the top', async () => {
    const { makeCharacter } = await import('../test-helpers.js');
    const card = makeCharacter({
      id: 'seer',
      effects: [
        {
          trigger: 'ON_PLAY',
          conditions: [],
          effects: [{ type: 'REORDER_TOP', amount: 3, tagFilter: 'Mystery' }],
        },
      ],
    });
    const state = makeBareMatchState({
      activePlayerId: 'p1',
      player1: {
        playerId: 'p1',
        deck: [
          { instanceId: 'd1', cardId: 'other' },
          { instanceId: 'd2', cardId: 'other' },
          { instanceId: 'd3', cardId: 'mystery-card' },
          { instanceId: 'd4', cardId: 'other' },
        ],
      },
      player2: { playerId: 'p2' },
    });
    const mysteryCard = makeCharacter({ id: 'mystery-card', tags: ['Mystery'] });

    runEffects({
      state,
      matchCtx: makeContext([card, mysteryCard]),
      trigger: 'ON_PLAY',
      ownerId: 'p1',
      sourceCardId: card.id,
      events: [],
    });

    expect(state.players.p1!.deck[0]!.instanceId).toBe('d3');
    expect(state.players.p1!.deck).toHaveLength(4);
  });

  it('sends a scanned card to the bottom when destination is BOTTOM', async () => {
    const { makeCharacter } = await import('../test-helpers.js');
    const card = makeCharacter({
      id: 'diviner',
      effects: [
        {
          trigger: 'ON_PLAY',
          conditions: [],
          effects: [{ type: 'REORDER_TOP', amount: 1, destination: 'BOTTOM' }],
        },
      ],
    });
    const state = makeBareMatchState({
      activePlayerId: 'p1',
      player1: {
        playerId: 'p1',
        deck: [
          { instanceId: 'd1', cardId: 'x' },
          { instanceId: 'd2', cardId: 'x' },
        ],
      },
      player2: { playerId: 'p2' },
    });

    runEffects({
      state,
      matchCtx: makeContext([card]),
      trigger: 'ON_PLAY',
      ownerId: 'p1',
      sourceCardId: card.id,
      events: [],
    });

    expect(state.players.p1!.deck.map((c) => c.instanceId)).toEqual(['d2', 'd1']);
  });
});

describe('runEffects — REPEAT_LAST_TRACK (deterministic Echo scaling)', () => {
  it('re-applies the last friendly Track effect at the given percent, floored', async () => {
    const { makeCharacter } = await import('../test-helpers.js');
    const echoCard = makeCharacter({
      id: 'echo',
      effects: [
        {
          trigger: 'ON_PLAY',
          conditions: [],
          effects: [{ type: 'REPEAT_LAST_TRACK', percent: 50 }],
        },
      ],
    });
    const state = makeBareMatchState({
      activePlayerId: 'p1',
      player1: { playerId: 'p1', conductorHp: 10 },
      player2: { playerId: 'p2' },
    });
    state.lastTrackEffect.p1 = {
      cardId: 'some-track',
      effects: [{ type: 'HEAL', target: 'FRIENDLY_CONDUCTOR', amount: 5 }],
    };

    runEffects({
      state,
      matchCtx: makeContext([echoCard]),
      trigger: 'ON_PLAY',
      ownerId: 'p1',
      sourceCardId: echoCard.id,
      events: [],
    });

    expect(state.players.p1!.conductorHp).toBe(12); // 10 + floor(5 * 50%)
  });

  it('does nothing if no Track has been played yet this match', async () => {
    const { makeCharacter } = await import('../test-helpers.js');
    const echoCard = makeCharacter({
      id: 'echo2',
      effects: [
        { trigger: 'ON_PLAY', conditions: [], effects: [{ type: 'REPEAT_LAST_TRACK' }] },
      ],
    });
    const state = makeBareMatchState({
      activePlayerId: 'p1',
      player1: { playerId: 'p1', conductorHp: 10 },
      player2: { playerId: 'p2' },
    });

    runEffects({
      state,
      matchCtx: makeContext([echoCard]),
      trigger: 'ON_PLAY',
      ownerId: 'p1',
      sourceCardId: echoCard.id,
      events: [],
    });

    expect(state.players.p1!.conductorHp).toBe(10);
  });
});

describe('runEffects — CHOOSE_ONE', () => {
  it('runs ifFriendlyTarget when the chosen target is friendly, ifEnemyTarget otherwise', async () => {
    const { makeCharacter } = await import('../test-helpers.js');
    const card = makeCharacter({
      id: 'chooser',
      effects: [
        {
          trigger: 'ON_PLAY',
          conditions: [],
          effects: [
            {
              type: 'CHOOSE_ONE',
              ifFriendlyTarget: [{ type: 'HEAL', target: 'FRIENDLY_CHOSEN', amount: 3 }],
              ifEnemyTarget: [{ type: 'DAMAGE', target: 'ENEMY_CHOSEN', amount: 3 }],
            },
          ],
        },
      ],
    });
    const ally = makeUnit({ ownerId: 'p1', cardId: 'ally', health: 1, maxHealth: 5 });
    const enemy = makeUnit({ ownerId: 'p2', cardId: 'enemy', health: 5, maxHealth: 5 });
    const state = makeBareMatchState({
      activePlayerId: 'p1',
      player1: { playerId: 'p1', board: [ally] },
      player2: { playerId: 'p2', board: [enemy] },
    });

    runEffects({
      state,
      matchCtx: makeContext([card]),
      trigger: 'ON_PLAY',
      ownerId: 'p1',
      sourceCardId: card.id,
      explicitTargetId: ally.instanceId,
      events: [],
    });
    expect(state.players.p1!.board[0]!.health).toBe(4);
    expect(state.players.p2!.board[0]!.health).toBe(5);

    runEffects({
      state,
      matchCtx: makeContext([card]),
      trigger: 'ON_PLAY',
      ownerId: 'p1',
      sourceCardId: card.id,
      explicitTargetId: enemy.instanceId,
      events: [],
    });
    expect(state.players.p2!.board[0]!.health).toBe(2);
  });
});

describe('runEffects — ONCE_PER_MATCH', () => {
  it('allows exactly one execution for the whole match, across turns', async () => {
    const { makeCharacter } = await import('../test-helpers.js');
    const card = makeCharacter({
      id: 'once-per-match-card',
      effects: [
        {
          trigger: 'ON_PLAY',
          conditions: [{ type: 'ONCE_PER_MATCH' }],
          effects: [{ type: 'GAIN_ENERGY', amount: 1 }],
        },
      ],
    });
    const state = makeBareMatchState({
      activePlayerId: 'p1',
      player1: { playerId: 'p1', energy: 0 },
      player2: { playerId: 'p2' },
    });

    runEffects({
      state,
      matchCtx: makeContext([card]),
      trigger: 'ON_PLAY',
      ownerId: 'p1',
      sourceCardId: card.id,
      events: [],
    });
    state.turn += 1;
    runEffects({
      state,
      matchCtx: makeContext([card]),
      trigger: 'ON_PLAY',
      ownerId: 'p1',
      sourceCardId: card.id,
      events: [],
    });

    expect(state.players.p1!.energy).toBe(1);
  });
});

describe('runEffects — TRIGGER_SOURCE target (reactive rune pattern)', () => {
  it('buffs the unit that triggered the reaction, not the rune itself', async () => {
    const { makeCharacter } = await import('../test-helpers.js');
    const played = makeUnit({
      ownerId: 'p1',
      cardId: 'played-char',
      attack: 2,
      health: 2,
      maxHealth: 2,
    });
    const rune = makeCharacter({
      id: 'reactive-rune',
      effects: [
        {
          trigger: 'ON_PLAY',
          conditions: [{ type: 'ONCE_PER_TURN' }],
          effects: [
            {
              type: 'BUFF',
              target: 'TRIGGER_SOURCE',
              attack: 1,
              health: 0,
              duration: 'END_OF_TURN',
            },
          ],
        },
      ],
    });
    const state = makeBareMatchState({
      activePlayerId: 'p1',
      player1: { playerId: 'p1', board: [played] },
      player2: { playerId: 'p2' },
    });

    runEffects({
      state,
      matchCtx: makeContext([rune]),
      trigger: 'ON_PLAY',
      ownerId: 'p1',
      sourceCardId: rune.id,
      triggerSourceInstanceId: played.instanceId,
      events: [],
    });

    expect(state.players.p1!.board[0]!.attack).toBe(3);
  });
});
