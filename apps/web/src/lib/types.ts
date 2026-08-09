import type { Card, Deck, DeckValidationResult, PublicUser } from '@kod-raido/shared';

export interface AuthResponse {
  user: PublicUser;
  accessToken: string;
  accessTokenExpiresAt: string;
}

export interface CollectionEntryDto {
  card: Card;
  quantity: number;
}

export type DeckDto = Deck & { validation?: DeckValidationResult };
