import { describe, expect, it } from 'vitest';
import type { Card, CardType, MatchEventView, MatchStateView } from '@kod-raido/shared';
import { evaluateAutoAdvance, nextStep, stepAtIndex, stepIndexOf, TUTORIAL_STEPS } from './tutorial-objectives';

function fakeCard(id: string, type: CardType): Card {
  return {
    id,
    slug: id,
    name: id,
    type,
    rarity: 'COMMON',
    cost: 1,
    tags: [],
    artworkUrl: '',
    rightsStatus: 'placeholder',
    active: true,
    isPlayable: true,
    resonanceTier: 0,
    ...(type === 'CHARACTER' ? { attack: 1, health: 1 } : {}),
  } as unknown as Card;
}

function fakeView(overrides: { runeCardIds?: string[] } = {}): MatchStateView {
  return {
    matchId: 'm1',
    turn: 2,
    activePlayerId: 'you',
    finished: false,
    you: {
      playerId: 'you',
      isBot: false,
      conductorHp: 30,
      energy: 3,
      maxEnergy: 3,
      hand: [],
      handCount: 0,
      deckCount: 0,
      discardCount: 0,
      board: [],
      runeCardIds: overrides.runeCardIds ?? [],
    },
    opponent: {
      playerId: 'bot',
      isBot: true,
      conductorHp: 30,
      energy: 3,
      maxEnergy: 3,
      hand: [],
      handCount: 0,
      deckCount: 0,
      discardCount: 0,
      board: [],
      runeCardIds: [],
    },
  };
}

describe('evaluateAutoAdvance', () => {
  const cardsById = new Map<string, Card>([
    ['char-1', fakeCard('char-1', 'CHARACTER')],
    ['rune-1', fakeCard('rune-1', 'RUNE')],
    ['track-1', fakeCard('track-1', 'TRACK')],
    ['event-1', fakeCard('event-1', 'EVENT')],
  ]);

  it('PLAY_CHARACTER advances only when a CARD_PLAYED event resolves to a CHARACTER-type card', () => {
    const view = fakeView();
    const wrongType: MatchEventView[] = [{ type: 'CARD_PLAYED', payload: { cardId: 'rune-1' } }];
    expect(evaluateAutoAdvance('PLAY_CHARACTER', wrongType, view, cardsById)).toBe(false);

    const rightType: MatchEventView[] = [{ type: 'CARD_PLAYED', payload: { cardId: 'char-1' } }];
    expect(evaluateAutoAdvance('PLAY_CHARACTER', rightType, view, cardsById)).toBe(true);
  });

  it('END_TURN advances only on the viewer\'s own TURN_END event', () => {
    const view = fakeView();
    const opponentTurnEnd: MatchEventView[] = [{ type: 'TURN_END', payload: { playerId: 'bot' } }];
    expect(evaluateAutoAdvance('END_TURN', opponentTurnEnd, view, cardsById)).toBe(false);

    const ownTurnEnd: MatchEventView[] = [{ type: 'TURN_END', payload: { playerId: 'you' } }];
    expect(evaluateAutoAdvance('END_TURN', ownTurnEnd, view, cardsById)).toBe(true);
  });

  it('ATTACK advances only when the viewer declared the attack', () => {
    const view = fakeView();
    const botAttack: MatchEventView[] = [{ type: 'ATTACK_DECLARED', payload: { playerId: 'bot' } }];
    expect(evaluateAutoAdvance('ATTACK', botAttack, view, cardsById)).toBe(false);

    const yourAttack: MatchEventView[] = [{ type: 'ATTACK_DECLARED', payload: { playerId: 'you' } }];
    expect(evaluateAutoAdvance('ATTACK', yourAttack, view, cardsById)).toBe(true);
  });

  it('PLAY_RUNE/PLAY_TRACK/PLAY_EVENT each key off the played card\'s own type, not its id', () => {
    const events = (cardId: string): MatchEventView[] => [{ type: 'CARD_PLAYED', payload: { cardId } }];
    expect(evaluateAutoAdvance('PLAY_RUNE', events('rune-1'), fakeView(), cardsById)).toBe(true);
    expect(evaluateAutoAdvance('PLAY_RUNE', events('track-1'), fakeView(), cardsById)).toBe(false);
    expect(evaluateAutoAdvance('PLAY_TRACK', events('track-1'), fakeView(), cardsById)).toBe(true);
    expect(evaluateAutoAdvance('PLAY_EVENT', events('event-1'), fakeView(), cardsById)).toBe(true);
  });

  it('RESONANCE requires an active rune, a played CHARACTER, and a bonus effect in the same batch', () => {
    const view = fakeView({ runeCardIds: ['rune-1'] });
    const fullBatch: MatchEventView[] = [
      { type: 'CARD_PLAYED', payload: { cardId: 'char-1' } },
      { type: 'UNIT_BUFFED', payload: {} },
    ];
    expect(evaluateAutoAdvance('RESONANCE', fullBatch, view, cardsById)).toBe(true);

    // No rune on the field yet - the bonus, even if it fired, isn't attributable to Resonance for teaching purposes.
    expect(evaluateAutoAdvance('RESONANCE', fullBatch, fakeView({ runeCardIds: [] }), cardsById)).toBe(false);

    // Rune present but no bonus event actually fired.
    const noBonus: MatchEventView[] = [{ type: 'CARD_PLAYED', payload: { cardId: 'char-1' } }];
    expect(evaluateAutoAdvance('RESONANCE', noBonus, view, cardsById)).toBe(false);
  });

  it('CONDUCTOR, ENERGY, and DONE never auto-advance (tap-driven or terminal)', () => {
    const view = fakeView();
    const anyEvents: MatchEventView[] = [{ type: 'CARD_PLAYED', payload: { cardId: 'char-1' } }];
    expect(evaluateAutoAdvance('CONDUCTOR', anyEvents, view, cardsById)).toBe(false);
    expect(evaluateAutoAdvance('ENERGY', anyEvents, view, cardsById)).toBe(false);
    expect(evaluateAutoAdvance('DONE', anyEvents, view, cardsById)).toBe(false);
  });
});

describe('step sequencing helpers', () => {
  it('nextStep advances one step and clamps at the end', () => {
    expect(nextStep('CONDUCTOR')).toBe('ENERGY');
    expect(nextStep('DONE')).toBe('DONE');
  });

  it('stepIndexOf/stepAtIndex round-trip and clamp out-of-range indices', () => {
    expect(stepIndexOf('ATTACK')).toBe(4);
    expect(stepAtIndex(4)).toBe('ATTACK');
    expect(stepAtIndex(-5)).toBe(TUTORIAL_STEPS[0]);
    expect(stepAtIndex(999)).toBe(TUTORIAL_STEPS[TUTORIAL_STEPS.length - 1]);
  });
});
