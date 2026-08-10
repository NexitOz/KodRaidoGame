import { Injectable } from '@nestjs/common';
import type { Card } from '@kod-raido/shared';
import type { Card as PrismaCard } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export function toCardDto(card: PrismaCard): Card {
  const base = {
    id: card.id,
    slug: card.slug,
    name: card.name,
    rarity: card.rarity as Card['rarity'],
    cost: card.cost,
    tags: card.tags,
    artworkUrl: card.artworkUrl,
    abilityText: card.abilityText ?? undefined,
    effects: (card.effectJson ?? []) as unknown as Card['effects'],
    linkedTrackIds: card.linkedTrackIds,
    boostProfileId: card.boostProfileId ?? undefined,
    rightsStatus: card.rightsStatus as Card['rightsStatus'],
    rightsNote: card.rightsNote ?? undefined,
    source: card.source ?? undefined,
    licenseExpiresAt: card.licenseExpiresAt?.toISOString(),
    isPlayable: card.isPlayable,
    active: card.active,
    isToken: card.isToken,
    resonanceTier: card.resonanceTier as Card['resonanceTier'],
    faction: card.faction,
    subFactions: card.subFactions,
    archetypeTags: card.archetypeTags,
    isNeutral: card.isNeutral,
    isCrossoverEligible: card.isCrossoverEligible,
    isReferenceContent: card.isReferenceContent,
  };

  switch (card.type) {
    case 'CHARACTER':
      return {
        ...base,
        type: 'CHARACTER',
        attack: card.attack ?? 0,
        health: card.health ?? 0,
        universe: card.universe ?? undefined,
        voiceStingerUrl: card.voiceStingerUrl ?? undefined,
      };
    case 'TRACK':
      return {
        ...base,
        type: 'TRACK',
        coverUrl: card.coverUrl ?? card.artworkUrl,
        audioPreviewUrl: card.audioPreviewUrl ?? undefined,
        releaseUrl: card.releaseUrl ?? undefined,
        releaseDate: card.releaseDate?.toISOString(),
      };
    case 'RUNE':
      return { ...base, type: 'RUNE' };
    case 'EVENT':
      return { ...base, type: 'EVENT' };
    case 'EDIT':
      return { ...base, type: 'EDIT', videoUrl: card.videoUrl ?? undefined };
    default:
      throw new Error(`Unknown card type: ${card.type as string}`);
  }
}

/**
 * Reference/dev-only content (isReferenceContent = true) is never seeded to production,
 * never granted to users, and must never appear in the public API or collection unless
 * this flag is explicitly enabled. Content Pack 01's cards are all original IP and are
 * never gated by this flag - it exists purely as forward-looking infrastructure.
 */
function isReferenceContentEnabled(): boolean {
  return process.env.REFERENCE_CONTENT_ENABLED === 'true';
}

@Injectable()
export class CardsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllPlayable(): Promise<Card[]> {
    const cards = await this.prisma.card.findMany({
      where: {
        active: true,
        rightsStatus: { not: 'blocked' },
        ...(isReferenceContentEnabled() ? {} : { isReferenceContent: false }),
      },
      orderBy: [{ type: 'asc' }, { cost: 'asc' }],
    });
    return cards.map(toCardDto);
  }

  async findOnePlayable(id: string): Promise<Card | null> {
    const card = await this.prisma.card.findFirst({
      where: {
        id,
        active: true,
        rightsStatus: { not: 'blocked' },
        ...(isReferenceContentEnabled() ? {} : { isReferenceContent: false }),
      },
    });
    return card ? toCardDto(card) : null;
  }
}
