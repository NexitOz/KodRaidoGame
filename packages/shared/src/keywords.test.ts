import { describe, expect, it } from 'vitest';
import { findKeywordsInText, KEYWORD_REGISTRY } from './keywords.js';

describe('KEYWORD_REGISTRY', () => {
  it('has a title and a short description for every keyword', () => {
    for (const def of Object.values(KEYWORD_REGISTRY)) {
      expect(def.title.length).toBeGreaterThan(0);
      expect(def.description.length).toBeGreaterThan(0);
      expect(def.description.length).toBeLessThan(200);
    }
  });
});

describe('findKeywordsInText', () => {
  it('returns an empty array for undefined or plain text', () => {
    expect(findKeywordsInText(undefined)).toEqual([]);
    expect(findKeywordsInText('Доберите 1 карту.')).toEqual([]);
  });

  it('detects a single keyword regardless of Russian case ending', () => {
    expect(findKeywordsInText('При выходе становится Скрытым.')).toEqual(['HIDDEN']);
    expect(findKeywordsInText('Существо получает Щит.')).toEqual(['SHIELD']);
  });

  it('detects multiple distinct keywords in first-appearance order', () => {
    const text = 'При Резонансе 5+ существо получает Щит и становится Скрытым.';
    expect(findKeywordsInText(text)).toEqual(['RESONANCE', 'SHIELD', 'HIDDEN']);
  });

  it('does not duplicate a keyword mentioned twice', () => {
    const text = 'Проклятый враг не может атаковать. Наложите Проклятие ещё раз.';
    expect(findKeywordsInText(text)).toEqual(['CURSE']);
  });

  it('detects both CLEANSE and CURSE when an ability removes a curse', () => {
    const text = 'При выходе: снимите Проклятие и Заглушение с выбранного союзника.';
    expect(findKeywordsInText(text)).toEqual(['CLEANSE', 'CURSE']);
  });

  it('is case-insensitive', () => {
    expect(findKeywordsInText('ИМПУЛЬС и импульс')).toEqual(['IMPULSE']);
  });
});
