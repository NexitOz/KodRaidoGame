import { describe, expect, it } from 'vitest';
import type { Card, Deck } from '@kod-raido/shared';
import { dominantFaction } from './deck-select';

function makeCard(overrides: Partial<Card> = {}): Card {
  return {
    id: 'card-1',
    slug: 'card-1',
    name: 'Test Card',
    type: 'CHARACTER',
    rarity: 'COMMON',
    cost: 2,
    tags: [],
    artworkUrl: '',
    effects: [],
    linkedTrackIds: [],
    rightsStatus: 'placeholder',
    isPlayable: true,
    active: true,
    isToken: false,
    resonanceTier: 0,
    faction: 'NEUTRAL',
    subFactions: [],
    archetypeTags: [],
    isNeutral: true,
    isCrossoverEligible: true,
    isReferenceContent: false,
    attack: 2,
    health: 2,
    ...overrides,
  } as Card;
}

function makeDeck(cards: Array<{ cardId: string; quantity: number }>): Deck {
  return {
    id: 'deck-1',
    userId: 'user-1',
    name: 'Test Deck',
    active: true,
    cards,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

describe('dominantFaction', () => {
  it('returns null for an all-NEUTRAL deck', () => {
    const cardsById = new Map([['n1', makeCard({ id: 'n1', faction: 'NEUTRAL' })]]);
    const deck = makeDeck([{ cardId: 'n1', quantity: 30 }]);
    expect(dominantFaction(deck, cardsById)).toBeNull();
  });

  it('picks the faction with the most copies, ignoring NEUTRAL', () => {
    const cardsById = new Map([
      ['n1', makeCard({ id: 'n1', faction: 'NEUTRAL' })],
      ['s1', makeCard({ id: 's1', faction: 'SHADOW' })],
      ['s2', makeCard({ id: 's2', faction: 'SHADOW' })],
      ['c1', makeCard({ id: 'c1', faction: 'COSMIC' })],
    ]);
    const deck = makeDeck([
      { cardId: 'n1', quantity: 10 },
      { cardId: 's1', quantity: 2 },
      { cardId: 's2', quantity: 2 },
      { cardId: 'c1', quantity: 1 },
    ]);
    expect(dominantFaction(deck, cardsById)).toBe('SHADOW');
  });

  it('ignores deck entries whose card is missing from the catalogue', () => {
    const cardsById = new Map([['s1', makeCard({ id: 's1', faction: 'SHADOW' })]]);
    const deck = makeDeck([
      { cardId: 's1', quantity: 1 },
      { cardId: 'unknown', quantity: 5 },
    ]);
    expect(dominantFaction(deck, cardsById)).toBe('SHADOW');
  });
});
