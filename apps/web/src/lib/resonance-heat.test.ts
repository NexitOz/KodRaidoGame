import { describe, expect, it } from 'vitest';
import type { Card, MatchStateView } from '@kod-raido/shared';
import { computeViewerResonanceHeat } from './resonance-heat';

function fakeCard(id: string, resonanceTier: 0 | 1 | 2 | 3 | 4 | 5): Card {
  return {
    id,
    slug: id,
    name: id,
    type: 'CHARACTER',
    rarity: 'COMMON',
    cost: 1,
    tags: [],
    attack: 1,
    health: 1,
    artworkUrl: '',
    rightsStatus: 'placeholder',
    active: true,
    isPlayable: true,
    resonanceTier,
  } as unknown as Card;
}

function fakeView(overrides: {
  boardTiers?: Array<0 | 1 | 2 | 3 | 4 | 5>;
  handTiers?: Array<0 | 1 | 2 | 3 | 4 | 5>;
}): MatchStateView {
  const boardTiers = overrides.boardTiers ?? [];
  const handTiers = overrides.handTiers ?? [];
  return {
    matchId: 'm1',
    turn: 1,
    activePlayerId: 'you',
    finished: false,
    you: {
      playerId: 'you',
      isBot: false,
      conductorHp: 30,
      energy: 1,
      maxEnergy: 1,
      hand: handTiers.map((t, i) => ({ instanceId: `h${i}`, card: fakeCard(`h${i}`, t) })),
      handCount: handTiers.length,
      deckCount: 0,
      discardCount: 0,
      board: boardTiers.map((t, i) => ({
        instanceId: `b${i}`,
        card: fakeCard(`b${i}`, t),
        attack: 1,
        health: 1,
        maxHealth: 1,
        statuses: [],
        summonedThisTurn: false,
        attackedThisTurn: false,
      })),
      runeCardIds: [],
    },
    opponent: {
      playerId: 'opp',
      isBot: true,
      conductorHp: 30,
      energy: 1,
      maxEnergy: 1,
      hand: [],
      handCount: 0,
      deckCount: 0,
      discardCount: 0,
      board: [],
      runeCardIds: [],
    },
  };
}

describe('computeViewerResonanceHeat', () => {
  it('returns 0 when the viewer has no cards anywhere', () => {
    expect(computeViewerResonanceHeat(fakeView({}))).toBe(0);
  });

  it('returns the highest tier among board units', () => {
    expect(computeViewerResonanceHeat(fakeView({ boardTiers: [1, 4, 2] }))).toBe(4);
  });

  it('returns the highest tier among hand cards', () => {
    expect(computeViewerResonanceHeat(fakeView({ handTiers: [0, 3] }))).toBe(3);
  });

  it('takes the max across both board and hand', () => {
    expect(computeViewerResonanceHeat(fakeView({ boardTiers: [2], handTiers: [5, 1] }))).toBe(5);
  });

  it('ignores the opponent entirely', () => {
    const view = fakeView({ boardTiers: [1] });
    view.opponent.board = [
      {
        instanceId: 'opp-unit',
        card: fakeCard('opp-card', 5),
        attack: 1,
        health: 1,
        maxHealth: 1,
        statuses: [],
        summonedThisTurn: false,
        attackedThisTurn: false,
      },
    ];
    expect(computeViewerResonanceHeat(view)).toBe(1);
  });
});
