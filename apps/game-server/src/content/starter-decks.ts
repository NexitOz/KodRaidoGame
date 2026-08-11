/**
 * Single source of truth for the six Content Pack 01 starter deck presets. Referenced by BOTH
 * `prisma/seed.ts` (demo user) and `StarterDeckProvisioningService` (real user provisioning) so
 * the two paths can never drift into two different definitions of "the starter decks".
 *
 * Keyed by card SLUG, never a database card id - ids are environment-specific (regenerated per
 * `prisma db seed` run), slugs are stable across environments. Names match
 * `apps/web/src/lib/starter-archetypes.ts`'s `deckName` values exactly - that file is the
 * purely-informational tutorial/archetypes UI label list, this is the source of the real decks
 * a fresh account actually receives. Keep them in sync; do not add a third representation.
 */

export interface StarterDeckCardEntry {
  slug: string;
  quantity: number;
}

export interface StarterDeckPreset {
  /** Stable, URL/log-safe identifier - never derived from the display name. */
  key: string;
  name: string;
  faction: string;
  entries: StarterDeckCardEntry[];
}

// Every Content Pack 01 starter deck runs all 10 Neutral cards at max legal copies (18),
// all 5 cards of its own faction at max legal copies (9), plus a 3-copy "splash" from a
// thematically complementary faction to reach exactly 30 - a playtesting baseline, not a
// claim of perfect balance. See docs/content-pack-01-balance.md.
const NEUTRAL_ENTRIES: StarterDeckCardEntry[] = [
  { slug: 'rune-of-raido', quantity: 1 },
  { slug: 'resonance-impulse', quantity: 2 },
  { slug: 'edits-echo', quantity: 2 },
  { slug: 'musical-burst', quantity: 2 },
  { slug: 'supporters-pulse', quantity: 2 },
  { slug: 'wave-of-comments', quantity: 2 },
  { slug: 'presave-signal', quantity: 2 },
  { slug: 'scene-transition', quantity: 2 },
  { slug: 'voice-of-subscribers', quantity: 2 },
  { slug: 'code-raido-resonance', quantity: 1 },
];

const FACTION_ENTRIES: Record<string, StarterDeckCardEntry[]> = {
  SHADOW: [
    { slug: 'whisper-of-the-forgotten', quantity: 2 },
    { slug: 'ashen-blade', quantity: 2 },
    { slug: 'keeper-of-smoldering-embers', quantity: 2 },
    { slug: 'rune-of-the-echoing-dusk', quantity: 2 },
    { slug: 'necromancer-of-the-twilight-order', quantity: 1 },
  ],
  PURIFICATION: [
    { slug: 'acolyte-of-the-white-rune', quantity: 2 },
    { slug: 'seal-of-the-curse', quantity: 2 },
    { slug: 'warden-of-the-barrier', quantity: 2 },
    { slug: 'rune-of-curse-breaking', quantity: 2 },
    { slug: 'high-warden-of-the-white-rune', quantity: 1 },
  ],
  BOND: [
    { slug: 'child-of-the-spring-light', quantity: 2 },
    { slug: 'keeper-of-the-promise', quantity: 2 },
    { slug: 'light-of-the-hearth', quantity: 2 },
    { slug: 'rune-of-reflected-light', quantity: 2 },
    { slug: 'matriarch-of-the-spring-light', quantity: 1 },
  ],
  VEIL: [
    { slug: 'blade-from-the-shadow', quantity: 2 },
    { slug: 'scouting-of-the-court', quantity: 2 },
    { slug: 'master-of-the-ambush', quantity: 2 },
    { slug: 'rune-of-the-nameless-court', quantity: 2 },
    { slug: 'lord-of-the-nameless-shadow', quantity: 1 },
  ],
  MYSTERY: [
    { slug: 'archivist-of-the-grey-mist', quantity: 2 },
    { slug: 'fortune-teller-of-the-mist', quantity: 2 },
    { slug: 'scroll-of-the-grey-archive', quantity: 2 },
    { slug: 'rune-of-foresight', quantity: 2 },
    { slug: 'keeper-of-the-grey-mist', quantity: 1 },
  ],
  COSMIC: [
    { slug: 'spark-of-the-stellar-stream', quantity: 2 },
    { slug: 'disciple-of-the-stellar-heirs', quantity: 2 },
    { slug: 'portal-of-the-stellar-stream', quantity: 2 },
    { slug: 'rune-of-the-stellar-tide', quantity: 2 },
    { slug: 'lord-of-the-stellar-stream', quantity: 1 },
  ],
};

const PRESET_DEFS: Array<{ key: string; name: string; faction: string; splash: StarterDeckCardEntry[] }> = [
  {
    key: 'shadow-aggro',
    name: 'Shadow Aggro',
    faction: 'SHADOW',
    splash: [
      { slug: 'blade-from-the-shadow', quantity: 2 },
      { slug: 'scouting-of-the-court', quantity: 1 },
    ],
  },
  {
    key: 'bond-sustain',
    name: 'Bond Sustain',
    faction: 'BOND',
    splash: [
      { slug: 'acolyte-of-the-white-rune', quantity: 2 },
      { slug: 'warden-of-the-barrier', quantity: 1 },
    ],
  },
  {
    key: 'mystery-control',
    name: 'Mystery Control',
    faction: 'MYSTERY',
    splash: [
      { slug: 'seal-of-the-curse', quantity: 2 },
      { slug: 'rune-of-curse-breaking', quantity: 1 },
    ],
  },
  {
    key: 'cosmic-ramp',
    name: 'Cosmic Ramp',
    faction: 'COSMIC',
    splash: [
      { slug: 'child-of-the-spring-light', quantity: 2 },
      { slug: 'keeper-of-the-promise', quantity: 1 },
    ],
  },
  {
    key: 'veil-tempo',
    name: 'Veil Tempo',
    faction: 'VEIL',
    splash: [
      { slug: 'whisper-of-the-forgotten', quantity: 2 },
      { slug: 'ashen-blade', quantity: 1 },
    ],
  },
  {
    key: 'purification-control',
    name: 'Purification Control',
    faction: 'PURIFICATION',
    splash: [
      { slug: 'archivist-of-the-grey-mist', quantity: 2 },
      { slug: 'scroll-of-the-grey-archive', quantity: 1 },
    ],
  },
];

export const STARTER_DECK_PRESETS: StarterDeckPreset[] = PRESET_DEFS.map((def) => ({
  key: def.key,
  name: def.name,
  faction: def.faction,
  entries: [...NEUTRAL_ENTRIES, ...FACTION_ENTRIES[def.faction]!, ...def.splash],
}));

// Fails fast at import time (seed run, server boot, or test run) if a future content edit ever
// breaks the "exactly 30 cards" invariant, rather than surfacing as a confusing deck-creation
// error deep inside a request.
for (const preset of STARTER_DECK_PRESETS) {
  const total = preset.entries.reduce((sum, e) => sum + e.quantity, 0);
  if (total !== 30) {
    throw new Error(`Starter deck preset "${preset.key}" has ${total} cards; expected exactly 30.`);
  }
}
