/**
 * First Player Experience 1.0: a curated 30-card deck built entirely from
 * existing Content Pack 01 cards (no new cards added), chosen so a fresh
 * player reliably sees a CHARACTER, a RUNE, a TRACK, and an EVENT within the
 * first several turns. Combined with TUTORIAL_MATCH_SEED (fixed,
 * deterministic) the opening draws are reproducible - see
 * docs/tutorial-fpx.md for the exact verified draw order.
 *
 * This list of slugs is only ever used to *build the deck itself* (which
 * cards are in it, mirroring how any real deck is built from slugs/ids) -
 * nothing downstream is allowed to treat these specific slugs as meaningful.
 * Which of these cards demonstrate the Resonance bonus is discovered
 * generically at match-creation time by scanning each card's own DSL for a
 * `RESONANCE_TIER_AT_LEAST` condition (`cardUsesResonance()` in
 * `@kod-raido/shared`, used by `MatchesService.buildTutorialBoostSnapshot`) -
 * not by a hardcoded slug list.
 */
export const TUTORIAL_DECK: Array<{ slug: string; quantity: number }> = [
  { slug: 'ashen-blade', quantity: 2 },
  { slug: 'child-of-the-spring-light', quantity: 2 },
  { slug: 'spark-of-the-stellar-stream', quantity: 2 },
  { slug: 'blade-from-the-shadow', quantity: 2 },
  { slug: 'acolyte-of-the-white-rune', quantity: 2 },
  { slug: 'disciple-of-the-stellar-heirs', quantity: 2 },
  { slug: 'keeper-of-smoldering-embers', quantity: 2 },
  { slug: 'presave-signal', quantity: 2 },
  { slug: 'musical-burst', quantity: 2 },
  { slug: 'resonance-impulse', quantity: 2 },
  { slug: 'voice-of-subscribers', quantity: 2 },
  { slug: 'wave-of-comments', quantity: 2 },
  { slug: 'seal-of-the-curse', quantity: 2 },
  { slug: 'rune-of-curse-breaking', quantity: 2 },
  { slug: 'scouting-of-the-court', quantity: 2 },
];

/**
 * The tutorial always uses the existing RESONANCE_MIDRANGE bot deck as its
 * opponent (see bot-decks.ts) - the tutorial bot's TUTORIAL difficulty
 * behaviour, not its deck, is what makes the match gentle.
 */
export const TUTORIAL_BOT_ARCHETYPE = 'RESONANCE_MIDRANGE' as const;

/**
 * Fixed so every player's tutorial opening is reproducible - deck shuffling
 * (see match-setup.ts) is keyed purely on this seed string, independent of
 * the player's actual userId. Never reused for a real PvE/PvP match.
 */
export const TUTORIAL_MATCH_SEED = 'kod-raido-tutorial-fpx-1-v1-3';
