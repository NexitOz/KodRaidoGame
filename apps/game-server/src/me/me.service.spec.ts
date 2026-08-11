import { describe, expect, it } from 'vitest';
import { MeService } from './me.service';

const BASE_CARD = {
  id: 'card-1',
  slug: 'card-1',
  name: 'Test Card',
  type: 'CHARACTER',
  rarity: 'COMMON',
  cost: 2,
  tags: [] as string[],
  attack: 2,
  health: 2,
  artworkUrl: '/p.png',
  abilityText: null,
  effectJson: [],
  linkedTrackIds: [] as string[],
  boostProfileId: null,
  rightsStatus: 'placeholder',
  rightsNote: null,
  source: null,
  licenseExpiresAt: null,
  isPlayable: true,
  active: true,
  isToken: false,
  resonanceTier: 0,
  faction: 'NEUTRAL',
  subFactions: [] as string[],
  archetypeTags: [] as string[],
  isNeutral: true,
  isCrossoverEligible: true,
  isReferenceContent: false,
  universe: null,
  voiceStingerUrl: null,
  coverUrl: null,
  audioPreviewUrl: null,
  releaseUrl: null,
  releaseDate: null,
  videoUrl: null,
};

interface FakeEntry {
  userId: string;
  quantity: number;
  card: typeof BASE_CARD;
}

function createFakePrisma(entries: FakeEntry[]) {
  return {
    collectionEntry: {
      async findMany({
        where,
      }: {
        where: { userId: string; quantity: { gt: number }; card?: { active: boolean } };
      }) {
        return entries.filter(
          (e) =>
            e.userId === where.userId &&
            e.quantity > where.quantity.gt &&
            (where.card?.active === undefined || e.card.active === where.card.active),
        );
      },
    },
  };
}

describe('MeService.getCollection', () => {
  /** Canonical Card Roster 1.0: a pre-existing CollectionEntry for an archived (active: false)
   * legacy card must never surface in /me/collection - the same invariant CardsService/
   * AuthService/validateDeck already enforce elsewhere. */
  it('excludes archived legacy cards even when the player already owns a CollectionEntry for one', async () => {
    const prisma = createFakePrisma([
      { userId: 'user-1', quantity: 2, card: { ...BASE_CARD, id: 'canonical', active: true } },
      { userId: 'user-1', quantity: 2, card: { ...BASE_CARD, id: 'legacy', active: false } },
    ]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const service = new MeService(prisma as any);

    const collection = await service.getCollection('user-1');
    expect(collection.map((e) => e.card.id)).toEqual(['canonical']);
  });

  it('excludes zero-quantity entries', async () => {
    const prisma = createFakePrisma([
      { userId: 'user-1', quantity: 0, card: { ...BASE_CARD, id: 'depleted', active: true } },
    ]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const service = new MeService(prisma as any);

    const collection = await service.getCollection('user-1');
    expect(collection).toHaveLength(0);
  });
});
