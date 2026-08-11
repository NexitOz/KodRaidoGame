import { Injectable, Logger } from '@nestjs/common';
import { validateDeck } from '@kod-raido/game-engine';
import type { Card } from '@kod-raido/shared';
import { toCardDto } from '../cards/cards.service';
import { PrismaService } from '../prisma/prisma.service';
import { STARTER_DECK_PRESETS } from '../content/starter-decks';

export interface EnsureStarterDecksResult {
  /** True only if THIS call actually created the decks - false for every later no-op call. */
  provisioned: boolean;
  deckCount: number;
}

@Injectable()
export class StarterDeckProvisioningService {
  private readonly logger = new Logger(StarterDeckProvisioningService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Grants the account all 6 Content Pack 01 starter decks (see `content/starter-decks.ts`),
   * exactly once, ever - not a repair daemon. Concurrency-safe: the conditional
   * `updateMany(... WHERE starterDecksProvisionedAt IS NULL)` inside the transaction means only
   * one of any number of simultaneous callers (two concurrent register/login requests for the
   * same brand-new account, for instance) ever sees `claim.count > 0` and proceeds to create
   * decks - Postgres serializes the competing UPDATEs and the losers' WHERE clause simply no
   * longer matches once the winner commits (the same pattern already proven by
   * TutorialService.complete()'s reward claim). If anything below throws, the whole transaction
   * - including the marker write - rolls back, so a later retry can still actually provision
   * rather than silently believing it already did.
   *
   * Deliberately does NOT re-check "does the user still have deck X" once the marker is set -
   * that would resurrect a starter deck the user intentionally deleted, which section 6 of the
   * spec explicitly forbids. Provisioning is initial-account bootstrap, not enforcement.
   */
  async ensureStarterDecks(userId: string): Promise<EnsureStarterDecksResult> {
    return this.prisma.$transaction(async (tx) => {
      const claim = await tx.user.updateMany({
        where: { id: userId, starterDecksProvisionedAt: null },
        data: { starterDecksProvisionedAt: new Date() },
      });
      if (claim.count === 0) {
        return { provisioned: false, deckCount: 0 };
      }

      const allSlugs = Array.from(
        new Set(STARTER_DECK_PRESETS.flatMap((preset) => preset.entries.map((e) => e.slug))),
      );
      const cardRows = await tx.card.findMany({ where: { slug: { in: allSlugs } } });
      const cardBySlug = new Map(cardRows.map((row) => [row.slug, row]));

      const missing = allSlugs.filter((slug) => !cardBySlug.has(slug));
      if (missing.length > 0) {
        throw new Error(
          `Starter deck provisioning cannot resolve card slug(s): ${missing.join(', ')}. ` +
            'Has the database been seeded with Content Pack 01?',
        );
      }

      const cardsById = new Map<string, Card>(cardRows.map((row) => [row.id, toCardDto(row)]));

      const owned = await tx.collectionEntry.findMany({
        where: { userId, cardId: { in: cardRows.map((row) => row.id) } },
      });
      const ownedByCardId = new Map(owned.map((entry) => [entry.cardId, entry.quantity]));

      for (const preset of STARTER_DECK_PRESETS) {
        const entries = preset.entries.map((e) => ({ cardId: cardBySlug.get(e.slug)!.id, quantity: e.quantity }));

        // Reuses game-engine's own deck-composition rules (exact 30-card size, per-rarity copy
        // limits, no tokens, no blocked/inactive cards) rather than re-implementing them here.
        const validation = validateDeck(entries, cardsById);
        if (!validation.valid) {
          throw new Error(
            `Starter deck preset "${preset.key}" failed validateDeck(): ` +
              validation.issues.map((issue) => issue.message).join('; '),
          );
        }

        for (const entry of preset.entries) {
          const have = ownedByCardId.get(cardBySlug.get(entry.slug)!.id) ?? 0;
          if (entry.quantity > have) {
            throw new Error(
              `Starter deck preset "${preset.key}" needs ${entry.quantity}x "${entry.slug}", ` +
                `user ${userId} only owns ${have}x.`,
            );
          }
        }

        await tx.deck.create({
          data: { userId, name: preset.name, cards: { create: entries } },
        });
      }

      this.logger.log(`Provisioned ${STARTER_DECK_PRESETS.length} starter decks for user ${userId}.`);
      return { provisioned: true, deckCount: STARTER_DECK_PRESETS.length };
    });
  }
}
