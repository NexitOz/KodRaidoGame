import {
  DECK_SIZE,
  deckLimitForRarity,
  type Card,
  type DeckCardEntry,
  type DeckValidationIssue,
  type DeckValidationResult,
} from '@kod-raido/shared';

/**
 * Pure, deterministic deck validation shared by the deck builder UI and the
 * game-server before a deck may be saved or taken into a match.
 */
export function validateDeck(
  entries: DeckCardEntry[],
  cardsById: Map<string, Card>,
): DeckValidationResult {
  const issues: DeckValidationIssue[] = [];
  let totalCards = 0;

  for (const entry of entries) {
    const card = cardsById.get(entry.cardId);
    if (!card) {
      issues.push({
        code: 'CARD_NOT_FOUND',
        cardId: entry.cardId,
        message: `Card ${entry.cardId} does not exist.`,
      });
      continue;
    }

    if (card.rightsStatus === 'blocked' || !card.active || !card.isPlayable) {
      issues.push({
        code: 'CARD_RIGHTS_BLOCKED',
        cardId: entry.cardId,
        message: `${card.name} is not available for play.`,
      });
      continue;
    }

    if (card.isToken) {
      issues.push({
        code: 'CARD_IS_TOKEN',
        cardId: entry.cardId,
        message: `${card.name} is a token and cannot be added to a deck.`,
      });
      continue;
    }

    const limit = deckLimitForRarity(card.rarity);
    if (entry.quantity > limit) {
      issues.push({
        code: 'CARD_QUANTITY_EXCEEDS_LIMIT',
        cardId: entry.cardId,
        message: `${card.name} allows at most ${limit} cop${limit === 1 ? 'y' : 'ies'} per deck.`,
      });
    }

    totalCards += entry.quantity;
  }

  if (totalCards < DECK_SIZE) {
    issues.push({
      code: 'DECK_TOO_SMALL',
      message: `Deck has ${totalCards} card(s); it must contain exactly ${DECK_SIZE}.`,
    });
  } else if (totalCards > DECK_SIZE) {
    issues.push({
      code: 'DECK_TOO_LARGE',
      message: `Deck has ${totalCards} card(s); it must contain exactly ${DECK_SIZE}.`,
    });
  }

  return { valid: issues.length === 0, totalCards, issues };
}
