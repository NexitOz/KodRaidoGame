import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { beforeEach, describe, expect, it } from 'vitest';
import { DecksService } from './decks.service';

interface FakeCardRow {
  id: string;
  slug: string;
  name: string;
  type: string;
  rarity: string;
  cost: number;
  tags: string[];
  attack: number | null;
  health: number | null;
  artworkUrl: string;
  abilityText: string | null;
  effectJson: unknown;
  linkedTrackIds: string[];
  boostProfileId: string | null;
  rightsStatus: string;
  rightsNote: string | null;
  source: string | null;
  licenseExpiresAt: Date | null;
  isPlayable: boolean;
  active: boolean;
  isToken: boolean;
  resonanceTier: number;
  universe: string | null;
  voiceStingerUrl: string | null;
  coverUrl: string | null;
  audioPreviewUrl: string | null;
  releaseUrl: string | null;
  releaseDate: Date | null;
  videoUrl: string | null;
}

function makeCard(id: string, overrides: Partial<FakeCardRow> = {}): FakeCardRow {
  return {
    id,
    slug: id,
    name: id,
    type: 'CHARACTER',
    rarity: 'COMMON',
    cost: 2,
    tags: [],
    attack: 2,
    health: 2,
    artworkUrl: '/p.png',
    abilityText: null,
    effectJson: [],
    linkedTrackIds: [],
    boostProfileId: null,
    rightsStatus: 'placeholder',
    rightsNote: null,
    source: null,
    licenseExpiresAt: null,
    isPlayable: true,
    active: true,
    isToken: false,
    resonanceTier: 0,
    universe: null,
    voiceStingerUrl: null,
    coverUrl: null,
    audioPreviewUrl: null,
    releaseUrl: null,
    releaseDate: null,
    videoUrl: null,
    ...overrides,
  };
}

function createFakePrisma(cards: FakeCardRow[], ownedByUser: Map<string, Map<string, number>>) {
  const decks: Array<{
    id: string;
    userId: string;
    name: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
  }> = [];
  const deckCards = new Map<string, Array<{ cardId: string; quantity: number }>>();
  let idCounter = 0;
  const nextId = () => `deck-${(idCounter += 1)}`;

  return {
    card: {
      async findMany() {
        return cards;
      },
    },
    collectionEntry: {
      async findMany({ where }: { where: { userId: string; cardId: { in: string[] } } }) {
        const owned = ownedByUser.get(where.userId) ?? new Map();
        return where.cardId.in
          .filter((cardId) => owned.has(cardId))
          .map((cardId) => ({ userId: where.userId, cardId, quantity: owned.get(cardId)! }));
      },
    },
    deck: {
      async create({
        data,
      }: {
        data: {
          userId: string;
          name: string;
          cards: { create: Array<{ cardId: string; quantity: number }> };
        };
      }) {
        const id = nextId();
        const row = {
          id,
          userId: data.userId,
          name: data.name,
          active: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        decks.push(row);
        deckCards.set(id, data.cards.create);
        return { ...row, cards: deckCards.get(id) };
      },
      async findUnique({ where }: { where: { id: string } }) {
        return decks.find((d) => d.id === where.id) ?? null;
      },
      async update({
        where,
        data,
      }: {
        where: { id: string };
        data: { name: string; cards: { create: Array<{ cardId: string; quantity: number }> } };
      }) {
        const row = decks.find((d) => d.id === where.id)!;
        row.name = data.name;
        row.updatedAt = new Date();
        deckCards.set(row.id, data.cards.create);
        return { ...row, cards: deckCards.get(row.id) };
      },
      async delete({ where }: { where: { id: string } }) {
        const idx = decks.findIndex((d) => d.id === where.id);
        if (idx >= 0) decks.splice(idx, 1);
      },
    },
    deckCard: {
      async deleteMany({ where }: { where: { deckId: string } }) {
        deckCards.set(where.deckId, []);
        return { count: 0 };
      },
    },
  };
}

describe('DecksService', () => {
  const cards: FakeCardRow[] = [];
  for (let i = 0; i < 15; i += 1) {
    cards.push(makeCard(`card-${i}`));
  }
  const legalEntries = cards.map((c) => ({ cardId: c.id, quantity: 2 }));

  let ownedByUser: Map<string, Map<string, number>>;
  let service: DecksService;

  beforeEach(() => {
    ownedByUser = new Map([['user-1', new Map(cards.map((c) => [c.id, 2]))]]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    service = new DecksService(createFakePrisma(cards, ownedByUser) as any);
  });

  it('creates a deck the user owns enough copies of and returns a valid validation result', async () => {
    const result = await service.create('user-1', { name: 'Shadow Aggro', cards: legalEntries });
    expect(result.validation.valid).toBe(true);
    expect(result.cards).toHaveLength(15);
  });

  it('rejects a deck that uses more copies than the player owns', async () => {
    ownedByUser.set('user-2', new Map([[cards[0]!.id, 1]]));
    await expect(
      service.create('user-2', { name: 'Greedy', cards: [{ cardId: cards[0]!.id, quantity: 2 }] }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('prevents editing a deck owned by another user', async () => {
    const created = await service.create('user-1', { name: 'Mine', cards: legalEntries });
    ownedByUser.set('user-2', new Map(cards.map((c) => [c.id, 2])));
    await expect(
      service.update('user-2', created.id, { name: 'Hijack', cards: legalEntries }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});
