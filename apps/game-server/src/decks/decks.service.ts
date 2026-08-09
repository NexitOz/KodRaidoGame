import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { validateDeck } from '@kod-raido/game-engine';
import type { Card, DeckValidationResult } from '@kod-raido/shared';
import type { Deck, DeckCard } from '@prisma/client';
import { toCardDto } from '../cards/cards.service';
import { PrismaService } from '../prisma/prisma.service';
import type { DeckCardEntryDto, UpsertDeckDto } from './dto/upsert-deck.dto';

type DeckWithCards = Deck & { cards: DeckCard[] };

@Injectable()
export class DecksService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string) {
    const decks = await this.prisma.deck.findMany({
      where: { userId },
      include: { cards: true },
      orderBy: { createdAt: 'asc' },
    });
    return decks.map((deck) => this.toDto(deck));
  }

  async create(userId: string, input: UpsertDeckDto) {
    await this.assertOwnsCards(userId, input.cards);
    const validation = await this.validate(input.cards);

    const deck = await this.prisma.deck.create({
      data: {
        userId,
        name: input.name,
        cards: { create: input.cards.map((c) => ({ cardId: c.cardId, quantity: c.quantity })) },
      },
      include: { cards: true },
    });

    return { ...this.toDto(deck), validation };
  }

  async update(userId: string, deckId: string, input: UpsertDeckDto) {
    const existing = await this.getOwnedDeckOrThrow(userId, deckId);
    await this.assertOwnsCards(userId, input.cards);
    const validation = await this.validate(input.cards);

    await this.prisma.deckCard.deleteMany({ where: { deckId: existing.id } });
    const deck = await this.prisma.deck.update({
      where: { id: existing.id },
      data: {
        name: input.name,
        cards: { create: input.cards.map((c) => ({ cardId: c.cardId, quantity: c.quantity })) },
      },
      include: { cards: true },
    });

    return { ...this.toDto(deck), validation };
  }

  async remove(userId: string, deckId: string) {
    const existing = await this.getOwnedDeckOrThrow(userId, deckId);
    await this.prisma.deck.delete({ where: { id: existing.id } });
    return { success: true };
  }

  private async getOwnedDeckOrThrow(userId: string, deckId: string): Promise<Deck> {
    const existing = await this.prisma.deck.findUnique({ where: { id: deckId } });
    if (!existing) throw new NotFoundException('Deck not found.');
    if (existing.userId !== userId) throw new ForbiddenException('You do not own this deck.');
    return existing;
  }

  private async validate(entries: DeckCardEntryDto[]): Promise<DeckValidationResult> {
    const cards = await this.prisma.card.findMany();
    const cardsById = new Map<string, Card>(cards.map((card) => [card.id, toCardDto(card)]));
    return validateDeck(entries, cardsById);
  }

  private async assertOwnsCards(userId: string, entries: DeckCardEntryDto[]): Promise<void> {
    if (entries.length === 0) return;
    const owned = await this.prisma.collectionEntry.findMany({
      where: { userId, cardId: { in: entries.map((e) => e.cardId) } },
    });
    const ownedByCard = new Map(owned.map((o) => [o.cardId, o.quantity]));

    for (const entry of entries) {
      const have = ownedByCard.get(entry.cardId) ?? 0;
      if (entry.quantity > have) {
        throw new BadRequestException(
          `You only own ${have}x of card ${entry.cardId}, cannot add ${entry.quantity}x to deck.`,
        );
      }
    }
  }

  private toDto(deck: DeckWithCards) {
    return {
      id: deck.id,
      userId: deck.userId,
      name: deck.name,
      active: deck.active,
      cards: deck.cards.map((c) => ({ cardId: c.cardId, quantity: c.quantity })),
      createdAt: deck.createdAt.toISOString(),
      updatedAt: deck.updatedAt.toISOString(),
    };
  }
}
