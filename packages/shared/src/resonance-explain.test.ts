import { describe, expect, it } from 'vitest';
import { cardUsesResonance, explainCardResonance } from './resonance-explain.js';
import type { CharacterCard } from './types/card.js';

function makeCard(overrides: Partial<CharacterCard> = {}): CharacterCard {
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
  };
}

describe('explainCardResonance', () => {
  it('reports isReactive: false for a card with no Resonance conditions', () => {
    const card = makeCard({
      effects: [{ trigger: 'ON_PLAY', conditions: [], effects: [{ type: 'DRAW', amount: 1 }] }],
    });
    const result = explainCardResonance(card);
    expect(result.isReactive).toBe(false);
    expect(result.tiers).toEqual([]);
  });

  it('extracts a single Tier bonus with a human-readable description', () => {
    const card = makeCard({
      effects: [
        {
          trigger: 'ON_PLAY',
          conditions: [{ type: 'RESONANCE_TIER_AT_LEAST', value: 3 }],
          effects: [{ type: 'DRAW', amount: 1 }],
        },
      ],
    });
    const result = explainCardResonance(card);
    expect(result.isReactive).toBe(true);
    expect(result.tiers).toEqual([{ tier: 3, descriptions: ['добор 1 карт(ы)'] }]);
  });

  it('separates multiple Tier thresholds and sorts them ascending', () => {
    const card = makeCard({
      effects: [
        {
          trigger: 'ON_PLAY',
          conditions: [{ type: 'RESONANCE_TIER_AT_LEAST', value: 5 }],
          effects: [{ type: 'SHIELD', target: 'FRIENDLY_ALL' }],
        },
        {
          trigger: 'ON_PLAY',
          conditions: [{ type: 'RESONANCE_TIER_AT_LEAST', value: 3 }],
          effects: [{ type: 'HEAL', target: 'FRIENDLY_ALL', amount: 2 }],
        },
      ],
    });
    const result = explainCardResonance(card);
    expect(result.tiers.map((t) => t.tier)).toEqual([3, 5]);
    expect(result.tiers[0]!.descriptions).toEqual(['лечение 2']);
    expect(result.tiers[1]!.descriptions).toEqual(['Щит']);
  });

  it('describes a CHOOSE_ONE action by summarizing both branches', () => {
    const card = makeCard({
      effects: [
        {
          trigger: 'ON_PLAY',
          conditions: [{ type: 'RESONANCE_TIER_AT_LEAST', value: 3 }],
          effects: [
            {
              type: 'CHOOSE_ONE',
              ifFriendlyTarget: [{ type: 'HEAL', target: 'FRIENDLY_CHOSEN', amount: 3 }],
              ifEnemyTarget: [{ type: 'DAMAGE', target: 'ENEMY_CHOSEN', amount: 2 }],
            },
          ],
        },
      ],
    });
    const result = explainCardResonance(card);
    expect(result.tiers[0]!.descriptions[0]).toBe('выбор: лечение 3 или 2 урона');
  });
});

describe('cardUsesResonance', () => {
  it('is false for a card with no Resonance conditions anywhere in its DSL', () => {
    const card = makeCard({
      effects: [{ trigger: 'ON_PLAY', conditions: [], effects: [{ type: 'DRAW', amount: 1 }] }],
    });
    expect(cardUsesResonance(card)).toBe(false);
  });

  it('is true regardless of the card\'s id/slug/name - purely a DSL scan', () => {
    const card = makeCard({
      id: 'totally-unrelated-id',
      slug: 'totally-unrelated-slug',
      name: 'Совершенно другое имя',
      effects: [
        {
          trigger: 'ON_PLAY',
          conditions: [{ type: 'RESONANCE_TIER_AT_LEAST', value: 3 }],
          effects: [{ type: 'DRAW', amount: 1 }],
        },
      ],
    });
    expect(cardUsesResonance(card)).toBe(true);
  });

  it('is true even when the Resonance-gated effect is not the first one defined', () => {
    const card = makeCard({
      effects: [
        { trigger: 'ON_PLAY', conditions: [], effects: [{ type: 'DRAW', amount: 1 }] },
        {
          trigger: 'TURN_START',
          conditions: [{ type: 'RESONANCE_TIER_AT_LEAST', value: 5 }],
          effects: [{ type: 'GAIN_ENERGY', amount: 1 }],
        },
      ],
    });
    expect(cardUsesResonance(card)).toBe(true);
  });
});
