import { STARTER_DECK_PRESETS } from '../content/starter-decks';

export type BotArchetype = 'SHADOW_AGGRO' | 'RESONANCE_MIDRANGE';

function presetEntries(key: string): Array<{ slug: string; quantity: number }> {
  const preset = STARTER_DECK_PRESETS.find((p) => p.key === key);
  if (!preset) throw new Error(`Unknown starter deck preset "${key}" referenced by BOT_DECKS.`);
  return preset.entries;
}

/**
 * Canonical Card Roster 1.0: bot decks used to hardcode a pre-Content-Pack-01 legacy card list
 * (kept the PvE bot playable even after those 23 cards were archived, but meant every bot match
 * showed a player cards no longer in their own Collection). They now reuse two of the six
 * canonical Content Pack 01 starter deck presets directly - same module
 * StarterDeckProvisioningService uses, so bot decks are guaranteed to stay legal (see that
 * module's own "exactly 30 cards" fail-fast check) without a second card list to maintain.
 */
export const BOT_DECKS: Record<BotArchetype, Array<{ slug: string; quantity: number }>> = {
  SHADOW_AGGRO: presetEntries('shadow-aggro'),
  RESONANCE_MIDRANGE: presetEntries('bond-sustain'),
};

export function pickRandomBotArchetype(): BotArchetype {
  return Math.random() < 0.5 ? 'SHADOW_AGGRO' : 'RESONANCE_MIDRANGE';
}
