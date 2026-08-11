export type StarterArchetypeDifficulty = 'ПРОСТО' | 'СРЕДНЕ' | 'СЛОЖНО';

export interface StarterArchetype {
  deckName: string;
  tagline: string;
  difficulty: StarterArchetypeDifficulty;
}

/**
 * Purely informational post-tutorial reading - a UX label only, matching the six starter deck
 * presets already seeded (`CP1_DECK_PRESETS` in prisma/seed.ts). No balance impact: the
 * difficulty label doesn't feed into matchmaking, bot tuning, or card stats anywhere.
 */
export const STARTER_ARCHETYPES: StarterArchetype[] = [
  {
    deckName: 'Shadow Aggro',
    tagline: 'Быстрый натиск: атакуй раньше, чем успеют ответить тебе.',
    difficulty: 'ПРОСТО',
  },
  {
    deckName: 'Bond Sustain',
    tagline: 'Лечи и укрепляй своих персонажей — вымотай соперника числом.',
    difficulty: 'ПРОСТО',
  },
  {
    deckName: 'Purification Control',
    tagline: 'Снимай проклятия, ставь щиты и держи поле под контролем.',
    difficulty: 'СРЕДНЕ',
  },
  {
    deckName: 'Veil Tempo',
    tagline: 'Скрытые персонажи и внезапные удары из тени.',
    difficulty: 'СРЕДНЕ',
  },
  {
    deckName: 'Cosmic Ramp',
    tagline: 'Копи энергию и разыгрывай мощные карты раньше срока.',
    difficulty: 'СРЕДНЕ',
  },
  {
    deckName: 'Mystery Control',
    tagline: 'Загляни в свою колоду и управляй тем, что придёт следующим.',
    difficulty: 'СЛОЖНО',
  },
];
