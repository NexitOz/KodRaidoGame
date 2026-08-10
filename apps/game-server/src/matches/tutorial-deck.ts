/**
 * First Player Experience 1.0: a curated 30-card deck built entirely from
 * existing Content Pack 01 cards (no new cards added), chosen so a fresh
 * player reliably sees a CHARACTER, a RUNE, a TRACK, and an EVENT within the
 * first several turns, plus one Resonance-reactive Rune ('voice-of-subscribers')
 * that also happens to be the deck's Rune-teaching card. Combined with
 * TUTORIAL_MATCH_SEED (fixed, deterministic) the opening draws are
 * reproducible - see docs/tutorial-fpx.md for the exact verified draw order.
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

/**
 * Slugs of the cards this deck relies on to demonstrate a Resonance-tiered
 * bonus. TutorialService gives these a synthetic, match-scoped Tier 3 boost
 * (see TutorialService.buildTutorialBoostSnapshot) - real ResonanceSnapshot
 * rows in the database are never touched, so this never affects any other
 * match or the live Resonance system.
 */
export const TUTORIAL_RESONANCE_DEMO_SLUGS = ['voice-of-subscribers', 'musical-burst'];
