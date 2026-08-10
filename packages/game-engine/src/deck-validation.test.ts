import { describe, expect, it } from 'vitest';
import type { Card, CharacterCard } from '@kod-raido/shared';
import { validateDeck } from './deck-validation.js';

function makeCharacter(overrides: Partial<CharacterCard>): CharacterCard {
  return {
    id: overrides.id ?? 'card-1',
    slug: overrides.slug ?? 'card-1',
    name: overrides.name ?? 'Test Character',
    type: 'CHARACTER',
    rarity: overrides.rarity ?? 'COMMON',
    cost: overrides.cost ?? 2,
    tags: overrides.tags ?? [],
    artworkUrl: '/placeholder.png',
    effects: [],
    linkedTrackIds: [],
    rightsStatus: overrides.rightsStatus ?? 'placeholder',
    isPlayable: overrides.isPlayable ?? true,
    active: overrides.active ?? true,
    isToken: overrides.isToken ?? false,
    resonanceTier: overrides.resonanceTier ?? 0,
    attack: 2,
    health: 2,
    faction: overrides.faction ?? 'NEUTRAL',
    subFactions: overrides.subFactions ?? [],
    archetypeTags: overrides.archetypeTags ?? [],
    isNeutral: overrides.isNeutral ?? true,
    isCrossoverEligible: overrides.isCrossoverEligible ?? true,
    isReferenceContent: overrides.isReferenceContent ?? false,
    ...overrides,
  };
}

function buildLegalDeckEntries(cardsById: Map<string, Card>) {
  // 15 unique cards x 2 copies = 30
  return Array.from(cardsById.keys()).map((cardId) => ({ cardId, quantity: 2 }));
}

describe('validateDeck', () => {
  it('accepts a deck with exactly 30 cards respecting copy limits', () => {
    const cardsById = new Map<string, Card>();
    for (let i = 0; i < 15; i += 1) {
      const id = `card-${i}`;
      cardsById.set(id, makeCharacter({ id, slug: id }));
    }
    const result = validateDeck(buildLegalDeckEntries(cardsById), cardsById);
    expect(result.valid).toBe(true);
    expect(result.totalCards).toBe(30);
    expect(result.issues).toHaveLength(0);
  });

  it('rejects a deck smaller than 30 cards', () => {
    const cardsById = new Map<string, Card>([['card-1', makeCharacter({ id: 'card-1' })]]);
    const result = validateDeck([{ cardId: 'card-1', quantity: 2 }], cardsById);
    expect(result.valid).toBe(false);
    expect(result.issues[0]?.code).toBe('DECK_TOO_SMALL');
  });

  it('rejects more than 2 copies of a common/rare/epic card', () => {
    const cardsById = new Map<string, Card>();
    for (let i = 0; i < 14; i += 1) {
      const id = `filler-${i}`;
      cardsById.set(id, makeCharacter({ id, slug: id }));
    }
    cardsById.set('over-limit', makeCharacter({ id: 'over-limit', slug: 'over-limit' }));

    const entries = Array.from(cardsById.keys())
      .filter((id) => id !== 'over-limit')
      .map((cardId) => ({ cardId, quantity: 2 }));
    entries.push({ cardId: 'over-limit', quantity: 3 });

    const result = validateDeck(entries, cardsById);
    expect(result.valid).toBe(false);
    expect(result.issues.some((issue) => issue.code === 'CARD_QUANTITY_EXCEEDS_LIMIT')).toBe(true);
  });

  it('limits Legendary and Raido cards to a single copy', () => {
    const cardsById = new Map<string, Card>();
    for (let i = 0; i < 14; i += 1) {
      const id = `filler-${i}`;
      cardsById.set(id, makeCharacter({ id, slug: id }));
    }
    cardsById.set('legend', makeCharacter({ id: 'legend', slug: 'legend', rarity: 'LEGENDARY' }));

    const entries = Array.from(cardsById.keys())
      .filter((id) => id !== 'legend')
      .map((cardId) => ({ cardId, quantity: 2 }));
    entries.push({ cardId: 'legend', quantity: 2 });

    const result = validateDeck(entries, cardsById);
    expect(result.valid).toBe(false);
    expect(
      result.issues.some(
        (issue) => issue.code === 'CARD_QUANTITY_EXCEEDS_LIMIT' && issue.cardId === 'legend',
      ),
    ).toBe(true);
  });

  it('rejects rights-blocked or inactive cards', () => {
    const cardsById = new Map<string, Card>([
      ['blocked', makeCharacter({ id: 'blocked', rightsStatus: 'blocked' })],
    ]);
    const result = validateDeck([{ cardId: 'blocked', quantity: 2 }], cardsById);
    expect(result.valid).toBe(false);
    expect(result.issues.some((issue) => issue.code === 'CARD_RIGHTS_BLOCKED')).toBe(true);
  });

  it('rejects token cards from being added to a deck', () => {
    const cardsById = new Map<string, Card>([
      ['token-1', makeCharacter({ id: 'token-1', isToken: true })],
    ]);
    const result = validateDeck([{ cardId: 'token-1', quantity: 2 }], cardsById);
    expect(result.valid).toBe(false);
    expect(result.issues.some((issue) => issue.code === 'CARD_IS_TOKEN')).toBe(true);
  });

  it('flags unknown card ids', () => {
    const result = validateDeck([{ cardId: 'ghost', quantity: 2 }], new Map());
    expect(result.valid).toBe(false);
    expect(result.issues.some((issue) => issue.code === 'CARD_NOT_FOUND')).toBe(true);
  });
});
