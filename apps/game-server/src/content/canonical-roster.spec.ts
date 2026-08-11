import { describe, expect, it } from 'vitest';
import { STARTER_DECK_PRESETS } from './starter-decks';
import { TUTORIAL_DECK } from '../matches/tutorial-deck';
import { BOT_DECKS } from '../matches/bot-decks';

/**
 * Canonical Card Roster 1.0: every deck the server can hand a player or a bot - starter decks,
 * the tutorial deck, and the PvE bot decks - must be built entirely from the 40 canonical
 * Content Pack 01 cards, never a legacy (archived) slug. The 40 canonical slugs are derived from
 * STARTER_DECK_PRESETS itself (10 shared Neutral cards + all 5 cards of each of the 6 factions,
 * see starter-decks.ts's own header comment) rather than duplicated here, so this suite can never
 * drift from the single source of truth.
 */
const CANONICAL_SLUGS = new Set(
  STARTER_DECK_PRESETS.flatMap((preset) => preset.entries.map((e) => e.slug)),
);

function totalCards(entries: Array<{ quantity: number }>): number {
  return entries.reduce((sum, e) => sum + e.quantity, 0);
}

describe('Canonical Card Roster 1.0', () => {
  it('the canonical set derived from starter decks is exactly 40 cards', () => {
    expect(CANONICAL_SLUGS.size).toBe(40);
  });

  describe('starter decks', () => {
    it('all 6 presets total exactly 30 cards each', () => {
      for (const preset of STARTER_DECK_PRESETS) {
        expect(totalCards(preset.entries)).toBe(30);
      }
    });

    it('every card slug across all 6 presets is canonical', () => {
      for (const preset of STARTER_DECK_PRESETS) {
        for (const entry of preset.entries) {
          expect(CANONICAL_SLUGS.has(entry.slug)).toBe(true);
        }
      }
    });
  });

  describe('tutorial deck', () => {
    it('totals exactly 30 cards', () => {
      expect(totalCards(TUTORIAL_DECK)).toBe(30);
    });

    it('every card slug is canonical', () => {
      for (const entry of TUTORIAL_DECK) {
        expect(CANONICAL_SLUGS.has(entry.slug)).toBe(true);
      }
    });
  });

  describe('bot decks', () => {
    it('every archetype totals exactly 30 cards', () => {
      for (const entries of Object.values(BOT_DECKS)) {
        expect(totalCards(entries)).toBe(30);
      }
    });

    it('every card slug in every bot deck is canonical', () => {
      for (const entries of Object.values(BOT_DECKS)) {
        for (const entry of entries) {
          expect(CANONICAL_SLUGS.has(entry.slug)).toBe(true);
        }
      }
    });
  });
});
