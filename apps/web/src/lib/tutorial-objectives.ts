import { cardUsesResonance, type Card, type MatchEventView, type MatchStateView } from '@kod-raido/shared';

export type TutorialStepId =
  | 'CONDUCTOR'
  | 'ENERGY'
  | 'PLAY_CHARACTER'
  | 'END_TURN'
  | 'ATTACK'
  | 'PLAY_RUNE'
  | 'PLAY_TRACK'
  | 'PLAY_EVENT'
  | 'RESONANCE'
  | 'DONE';

export const TUTORIAL_STEPS: TutorialStepId[] = [
  'CONDUCTOR',
  'ENERGY',
  'PLAY_CHARACTER',
  'END_TURN',
  'ATTACK',
  'PLAY_RUNE',
  'PLAY_TRACK',
  'PLAY_EVENT',
  'RESONANCE',
  'DONE',
];

export interface TutorialStepContent {
  id: TutorialStepId;
  title: string;
  body: string;
  /** data-tutorial-target value the overlay should spotlight, or null for no spotlight. */
  target: string | null;
  /** 'tap': a visible "Понятно"/"Далее" button advances. 'auto': advances when the game state itself proves the objective, per evaluateAutoAdvance. */
  advanceKind: 'tap' | 'auto';
}

export const TUTORIAL_STEP_CONTENT: Record<TutorialStepId, TutorialStepContent> = {
  CONDUCTOR: {
    id: 'CONDUCTOR',
    title: 'Твой Проводник',
    body: 'Это твой Проводник. Если его здоровье упадёт до нуля, матч проигран.',
    target: 'own-conductor',
    advanceKind: 'tap',
  },
  ENERGY: {
    id: 'ENERGY',
    title: 'Энергия',
    body: 'Энергия нужна для розыгрыша карт. В начале матча её мало, но постепенно станет больше.',
    target: 'own-conductor',
    advanceKind: 'tap',
  },
  PLAY_CHARACTER: {
    id: 'PLAY_CHARACTER',
    title: 'Персонаж',
    body: 'Сыграй персонажа.',
    target: 'hand-character',
    advanceKind: 'auto',
  },
  END_TURN: {
    id: 'END_TURN',
    title: 'Новобранцы устают с дороги',
    body: 'Новый персонаж обычно не атакует сразу. Заверши ход.',
    target: 'end-turn',
    advanceKind: 'auto',
  },
  ATTACK: {
    id: 'ATTACK',
    title: 'Атака',
    body: 'Теперь персонаж готов. Выбери его и атакуй противника.',
    target: 'own-board',
    advanceKind: 'auto',
  },
  PLAY_RUNE: {
    id: 'PLAY_RUNE',
    title: 'Руна',
    body: 'Руны остаются рядом с полем и реагируют на события матча.',
    target: 'hand-rune',
    advanceKind: 'auto',
  },
  PLAY_TRACK: {
    id: 'PLAY_TRACK',
    title: 'Трек',
    body: 'Треки меняют состояние боя. Некоторые карты становятся сильнее вместе с Резонансом.',
    target: 'hand-track',
    advanceKind: 'auto',
  },
  PLAY_EVENT: {
    id: 'PLAY_EVENT',
    title: 'Событие',
    body: 'События дают мгновенный эффект и исчезают после применения.',
    target: 'hand-event',
    advanceKind: 'auto',
  },
  RESONANCE: {
    id: 'RESONANCE',
    title: 'Резонанс',
    body: 'Резонанс отражает активность вокруг музыки Код Райдо. У некоторых карт высокий уровень Резонанса открывает дополнительный эффект.',
    target: 'resonance',
    advanceKind: 'auto',
  },
  DONE: {
    id: 'DONE',
    title: 'Готово',
    body: '',
    target: null,
    advanceKind: 'tap',
  },
};

/** Resonance-triggered bonus effect types the RESONANCE step watches for. */
const RESONANCE_BONUS_EVENT_TYPES = new Set([
  'UNIT_BUFFED',
  'SHIELD_CONSUMED',
  'STATUS_ADDED',
  'UNIT_HEALED',
  'CONDUCTOR_HEALED',
  'CARD_DRAWN',
  'ENERGY_GAINED',
]);

/**
 * Decides whether the current step's objective was just satisfied by the
 * latest batch of events from a single action response. Purely type/trigger
 * based - never inspects a specific cardId, so it works unmodified for any
 * card that happens to be in the tutorial deck.
 */
export function evaluateAutoAdvance(
  step: TutorialStepId,
  events: MatchEventView[],
  view: MatchStateView,
  cardsById: Map<string, Card>,
): boolean {
  const cardTypeOf = (cardId: string) => cardsById.get(cardId)?.type;

  switch (step) {
    case 'PLAY_CHARACTER':
      return events.some((e) => e.type === 'CARD_PLAYED' && cardTypeOf(e.payload.cardId as string) === 'CHARACTER');
    case 'END_TURN':
      return events.some((e) => e.type === 'TURN_END' && e.payload.playerId === view.you.playerId);
    case 'ATTACK':
      return events.some((e) => e.type === 'ATTACK_DECLARED' && e.payload.playerId === view.you.playerId);
    case 'PLAY_RUNE':
      return events.some((e) => e.type === 'CARD_PLAYED' && cardTypeOf(e.payload.cardId as string) === 'RUNE');
    case 'PLAY_TRACK':
      return events.some((e) => e.type === 'CARD_PLAYED' && cardTypeOf(e.payload.cardId as string) === 'TRACK');
    case 'PLAY_EVENT':
      return events.some((e) => e.type === 'CARD_PLAYED' && cardTypeOf(e.payload.cardId as string) === 'EVENT');
    case 'RESONANCE': {
      // Requiring the active rune to itself carry Resonance DSL (not just "any rune is out")
      // rules out a random unrelated BUFF/HEAL from an ordinary, non-Resonance-reactive rune
      // coinciding with a Character play - the closest this event model gets to "this bonus was
      // actually caused by Resonance" without tagging individual events with their source card.
      const activeResonanceRune = view.you.runeCardIds.some((cardId) => {
        const card = cardsById.get(cardId);
        return card ? cardUsesResonance(card) : false;
      });
      const playedCharacter = events.some(
        (e) => e.type === 'CARD_PLAYED' && cardTypeOf(e.payload.cardId as string) === 'CHARACTER',
      );
      const bonusFired = events.some((e) => RESONANCE_BONUS_EVENT_TYPES.has(e.type));
      return activeResonanceRune && playedCharacter && bonusFired;
    }
    case 'CONDUCTOR':
    case 'ENERGY':
    case 'DONE':
      return false;
  }
}

/**
 * Steps whose objective can be reconstructed purely from the current match state (no event
 * history needed). Used to fast-forward past a step on load/refresh when it turns out to already
 * be true - e.g. the player played their Character, then refreshed before the next event batch
 * was recorded client-side. Steps without a durable state signal (PLAY_TRACK, PLAY_EVENT,
 * RESONANCE's bonus pulse) are left alone; the overlay's manual "Продолжить обучение" fallback
 * covers those instead. See docs/tutorial-fpx.md "known simplifications".
 */
const STATE_SATISFIED: Partial<Record<TutorialStepId, (view: MatchStateView) => boolean>> = {
  PLAY_CHARACTER: (view) => view.you.board.length > 0,
  PLAY_RUNE: (view) => view.you.runeCardIds.length > 0,
};

/** Re-derives a safe resume point from real match state, never from a client-side guess alone. */
export function resolveResumeStep(persistedStep: TutorialStepId, view: MatchStateView): TutorialStepId {
  let step = persistedStep;
  for (;;) {
    const isSatisfied = STATE_SATISFIED[step];
    if (!isSatisfied || !isSatisfied(view)) return step;
    const next = nextStep(step);
    if (next === step) return step;
    step = next;
  }
}

export function nextStep(current: TutorialStepId): TutorialStepId {
  const index = TUTORIAL_STEPS.indexOf(current);
  return TUTORIAL_STEPS[Math.min(index + 1, TUTORIAL_STEPS.length - 1)]!;
}

export function stepIndexOf(step: TutorialStepId): number {
  return TUTORIAL_STEPS.indexOf(step);
}

export function stepAtIndex(index: number): TutorialStepId {
  const clamped = Math.max(0, Math.min(index, TUTORIAL_STEPS.length - 1));
  return TUTORIAL_STEPS[clamped]!;
}
