export type BotArchetype = 'SHADOW_AGGRO' | 'RESONANCE_MIDRANGE';

/**
 * Bot decks mirror the two dev-deck presets from the seed script (by card
 * slug), so PvE opponents are always valid, thematically consistent 30-card
 * decks regardless of which cards a given human player happens to own.
 */
export const BOT_DECKS: Record<BotArchetype, Array<{ slug: string; quantity: number }>> = {
  SHADOW_AGGRO: [
    { slug: 'kael-rider-of-ash', quantity: 2 },
    { slug: 'vex-the-silent', quantity: 2 },
    { slug: 'nyra-bloodrune', quantity: 2 },
    { slug: 'draven-nightblade', quantity: 2 },
    { slug: 'selene-duskcaller', quantity: 2 },
    { slug: 'morrigan-voice-of-ash', quantity: 2 },
    { slug: 'raiden-umbra', quantity: 1 },
    { slug: 'korrath-hollow-king', quantity: 1 },
    { slug: 'awakening-of-shadow', quantity: 2 },
    { slug: 'drakes-voice', quantity: 2 },
    { slug: 'surge-of-energy', quantity: 2 },
    { slug: 'shadow-breakthrough', quantity: 2 },
    { slug: 'seal-of-silence', quantity: 2 },
    { slug: 'rune-of-raido', quantity: 1 },
    { slug: 'rune-of-shadow', quantity: 2 },
    { slug: 'rune-of-echo', quantity: 2 },
    { slug: 'aria-lightweaver', quantity: 1 },
  ],
  RESONANCE_MIDRANGE: [
    { slug: 'bram-stonewarden', quantity: 2 },
    { slug: 'wren-songkeeper', quantity: 2 },
    { slug: 'halcyon-the-resonant', quantity: 1 },
    { slug: 'aria-lightweaver', quantity: 2 },
    { slug: 'echo-of-resonance', quantity: 2 },
    { slug: 'code-raido-awakening', quantity: 1 },
    { slug: 'resonance-recovery', quantity: 2 },
    { slug: 'seal-of-silence', quantity: 2 },
    { slug: 'rune-of-the-skybound', quantity: 2 },
    { slug: 'rune-of-echo', quantity: 2 },
    { slug: 'rune-of-raido', quantity: 1 },
    { slug: 'vex-the-silent', quantity: 2 },
    { slug: 'nyra-bloodrune', quantity: 2 },
    { slug: 'korrath-hollow-king', quantity: 1 },
    { slug: 'morrigan-voice-of-ash', quantity: 2 },
    { slug: 'selene-duskcaller', quantity: 2 },
    { slug: 'kael-rider-of-ash', quantity: 2 },
  ],
};

export function pickRandomBotArchetype(): BotArchetype {
  return Math.random() < 0.5 ? 'SHADOW_AGGRO' : 'RESONANCE_MIDRANGE';
}
