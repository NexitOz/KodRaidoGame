import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { CardsService } from './cards.service';

const BASE_ROW = {
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

function createFakePrisma(rows: (typeof BASE_ROW)[]) {
  return {
    card: {
      async findMany({ where }: { where: Record<string, unknown> }) {
        return rows.filter((row) => matches(row, where));
      },
      async findFirst({ where }: { where: Record<string, unknown> }) {
        return rows.find((row) => matches(row, where)) ?? null;
      },
    },
  };
}

function matches(row: typeof BASE_ROW, where: Record<string, unknown>): boolean {
  return Object.entries(where).every(([key, value]) => {
    if (key === 'rightsStatus') return true; // { not: 'blocked' } - not exercised here
    return (row as Record<string, unknown>)[key] === value;
  });
}

describe('CardsService — REFERENCE_CONTENT_ENABLED gating', () => {
  const originalFlag = process.env.REFERENCE_CONTENT_ENABLED;

  beforeEach(() => {
    delete process.env.REFERENCE_CONTENT_ENABLED;
  });

  afterEach(() => {
    if (originalFlag === undefined) delete process.env.REFERENCE_CONTENT_ENABLED;
    else process.env.REFERENCE_CONTENT_ENABLED = originalFlag;
  });

  it('excludes reference-content cards from the public API by default', async () => {
    const prisma = createFakePrisma([
      { ...BASE_ROW, id: 'normal', isReferenceContent: false },
      { ...BASE_ROW, id: 'reference', isReferenceContent: true },
    ]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const service = new CardsService(prisma as any);

    const cards = await service.findAllPlayable();
    expect(cards.map((c) => c.id)).toEqual(['normal']);
  });

  it('includes reference-content cards once REFERENCE_CONTENT_ENABLED=true', async () => {
    process.env.REFERENCE_CONTENT_ENABLED = 'true';
    const prisma = createFakePrisma([
      { ...BASE_ROW, id: 'normal', isReferenceContent: false },
      { ...BASE_ROW, id: 'reference', isReferenceContent: true },
    ]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const service = new CardsService(prisma as any);

    const cards = await service.findAllPlayable();
    expect(cards.map((c) => c.id).sort()).toEqual(['normal', 'reference']);
  });

  /** Canonical Card Roster 1.0: archived legacy cards (active: false) must never appear in the
   * public /api/cards catalog the web Collection page and Deck Builder both read from. */
  it('excludes archived (active: false) legacy cards from the public API', async () => {
    const prisma = createFakePrisma([
      { ...BASE_ROW, id: 'canonical', active: true },
      { ...BASE_ROW, id: 'legacy', active: false },
    ]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const service = new CardsService(prisma as any);

    const cards = await service.findAllPlayable();
    expect(cards.map((c) => c.id)).toEqual(['canonical']);
    expect(await service.findOnePlayable('legacy')).toBeNull();
  });

  it('maps faction/subFactions/archetypeTags through to the DTO', async () => {
    const prisma = createFakePrisma([
      {
        ...BASE_ROW,
        id: 'shadow-card',
        faction: 'SHADOW',
        subFactions: ['Орден Сумеречного Эха'],
        archetypeTags: ['Summon', 'DeathTrigger'],
        isNeutral: false,
      },
    ]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const service = new CardsService(prisma as any);

    const card = await service.findOnePlayable('shadow-card');
    expect(card?.faction).toBe('SHADOW');
    expect(card?.subFactions).toEqual(['Орден Сумеречного Эха']);
    expect(card?.archetypeTags).toEqual(['Summon', 'DeathTrigger']);
    expect(card?.isNeutral).toBe(false);
  });
});
