export const FACTION_LABEL: Record<string, string> = {
  NEUTRAL: 'Нейтральные',
  SHADOW: 'Орден Сумеречного Эха',
  PURIFICATION: 'Стражи Белой Руны',
  BOND: 'Дом Весеннего Света',
  VEIL: 'Двор Безымянной Тени',
  MYSTERY: 'Архив Серого Тумана',
  COSMIC: 'Наследники Звёздного Потока',
};

export const FACTION_ORDER = [
  'NEUTRAL',
  'SHADOW',
  'PURIFICATION',
  'BOND',
  'VEIL',
  'MYSTERY',
  'COSMIC',
];

export function factionLabel(faction: string): string {
  return FACTION_LABEL[faction] ?? faction;
}
