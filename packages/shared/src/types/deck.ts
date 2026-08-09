export interface DeckCardEntry {
  cardId: string;
  quantity: number;
}

export interface Deck {
  id: string;
  userId: string;
  name: string;
  active: boolean;
  cards: DeckCardEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface DeckValidationIssue {
  code:
    | 'DECK_TOO_SMALL'
    | 'DECK_TOO_LARGE'
    | 'CARD_QUANTITY_EXCEEDS_LIMIT'
    | 'CARD_NOT_PLAYABLE'
    | 'CARD_NOT_FOUND'
    | 'CARD_RIGHTS_BLOCKED'
    | 'CARD_NOT_OWNED';
  cardId?: string;
  message: string;
}

export interface DeckValidationResult {
  valid: boolean;
  totalCards: number;
  issues: DeckValidationIssue[];
}
