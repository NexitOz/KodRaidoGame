/**
 * First Player Experience 1.0: a single generic keyword registry, shared by the
 * Battlefield "?" help sheet and the in-ability-text keyword tooltip system.
 * Never hardcode a tooltip per cardId - every card that carries one of these
 * concepts (via its type or its DSL-driven ability text) gets the explanation
 * for free.
 */
export type KeywordId =
  | 'CHARACTER'
  | 'TRACK'
  | 'RUNE'
  | 'EVENT'
  | 'ENERGY'
  | 'RESONANCE'
  | 'SHIELD'
  | 'HIDDEN'
  | 'CURSE'
  | 'CLEANSE'
  | 'IMPULSE';

export interface KeywordDefinition {
  id: KeywordId;
  title: string;
  /** 1-2 sentences max. */
  description: string;
  /**
   * Word stems used to detect this keyword inside free-form Russian ability
   * text (case-insensitive prefix match, to tolerate Russian inflection -
   * e.g. "Скрыт" matches "Скрытым", "Скрытого"). Empty for keywords that are
   * card-type labels rather than words appearing inside ability text.
   */
  matchStems: string[];
}

export const KEYWORD_REGISTRY: Record<KeywordId, KeywordDefinition> = {
  CHARACTER: {
    id: 'CHARACTER',
    title: 'Персонаж (Character)',
    description: 'Существо, которое выходит на поле боя и может атаковать.',
    matchStems: [],
  },
  TRACK: {
    id: 'TRACK',
    title: 'Трек (Track)',
    description: 'Меняет состояние боя одноразовым эффектом и уходит в сброс.',
    matchStems: [],
  },
  RUNE: {
    id: 'RUNE',
    title: 'Руна (Rune)',
    description: 'Остаётся рядом с полем и реагирует на события матча снова и снова.',
    matchStems: [],
  },
  EVENT: {
    id: 'EVENT',
    title: 'Событие (Event)',
    description: 'Даёт мгновенный эффект и сразу уходит в сброс.',
    matchStems: [],
  },
  ENERGY: {
    id: 'ENERGY',
    title: 'Энергия',
    description: 'Нужна для розыгрыша карт. В начале матча её мало, но с каждым ходом становится больше.',
    matchStems: ['энерги'],
  },
  RESONANCE: {
    id: 'RESONANCE',
    title: 'Резонанс',
    description:
      'Отражает активность вокруг музыки Код Райдо. У некоторых карт высокий уровень открывает дополнительный эффект — не у всех карт сразу.',
    matchStems: ['резонанс'],
  },
  SHIELD: {
    id: 'SHIELD',
    title: 'Щит',
    description: 'Полностью поглощает следующий урон, затем исчезает.',
    matchStems: ['щит'],
  },
  HIDDEN: {
    id: 'HIDDEN',
    title: 'Скрытый',
    description: 'Не может быть выбран целью, пока сам не атакует.',
    matchStems: ['скрыт'],
  },
  CURSE: {
    id: 'CURSE',
    title: 'Проклятие',
    description: 'Проклятое существо не может атаковать, пока проклятие не снято.',
    matchStems: ['проклят'],
  },
  CLEANSE: {
    id: 'CLEANSE',
    title: 'Очищение',
    description: 'Снимает Проклятие и Заглушение с существа.',
    matchStems: ['очист', 'снимите проклят', 'снимает проклят'],
  },
  IMPULSE: {
    id: 'IMPULSE',
    title: 'Импульс',
    description: 'Позволяет существу атаковать в тот же ход, когда оно вышло на поле.',
    matchStems: ['импульс'],
  },
};

export const KEYWORD_IDS = Object.keys(KEYWORD_REGISTRY) as KeywordId[];

/**
 * Finds every keyword whose stem appears in the given ability text, in order
 * of first appearance. Case-insensitive, dedupes repeated mentions. Purely
 * textual - never inspects cardId, so it works unmodified for any future card.
 */
export function findKeywordsInText(text: string | undefined): KeywordId[] {
  if (!text) return [];
  const lower = text.toLowerCase();
  const found: Array<{ id: KeywordId; index: number }> = [];

  for (const def of Object.values(KEYWORD_REGISTRY)) {
    for (const stem of def.matchStems) {
      const index = lower.indexOf(stem.toLowerCase());
      if (index !== -1) {
        found.push({ id: def.id, index });
        break;
      }
    }
  }

  return found.sort((a, b) => a.index - b.index).map((f) => f.id);
}
