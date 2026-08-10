import { beforeEach, describe, expect, it } from 'vitest';
import { ResonanceService } from './resonance.service';

interface FakeCard {
  id: string;
  slug: string;
  name: string;
  active: boolean;
  resonanceTier: number;
}

interface FakeSnapshot {
  cardId: string;
  score: number;
  tier: number;
  boostPercent: number;
  calculatedAt: Date;
}

function createFakePrisma() {
  const cards: FakeCard[] = [];
  const snapshots: FakeSnapshot[] = [];

  return {
    card: {
      async findMany({ where }: { where: { active: boolean } }) {
        return cards
          .filter((c) => c.active === where.active)
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((c) => ({ id: c.id, slug: c.slug, name: c.name, resonanceTier: c.resonanceTier }));
      },
    },
    resonanceSnapshot: {
      async findMany({
        where,
        orderBy,
      }: {
        where: { cardId: string | { in: string[] }; calculatedAt?: { gte: Date } };
        orderBy?: { calculatedAt: 'asc' | 'desc' };
      }) {
        const cardId = where.cardId;
        let rows = snapshots.slice();
        if (typeof cardId === 'string') {
          rows = rows.filter((s) => s.cardId === cardId);
        } else {
          rows = rows.filter((s) => cardId.in.includes(s.cardId));
        }
        const calculatedAtFilter = where.calculatedAt;
        if (calculatedAtFilter) {
          rows = rows.filter((s) => s.calculatedAt >= calculatedAtFilter.gte);
        }
        const direction = orderBy?.calculatedAt === 'asc' ? 1 : -1;
        return rows.sort((a, b) => direction * (a.calculatedAt.getTime() - b.calculatedAt.getTime()));
      },
    },
    _internal: { cards, snapshots },
  };
}

describe('ResonanceService', () => {
  let prisma: ReturnType<typeof createFakePrisma>;
  let service: ResonanceService;

  beforeEach(() => {
    prisma = createFakePrisma();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    service = new ResonanceService(prisma as any);
  });

  it('falls back to the denormalized Card.resonanceTier for a card with no snapshots yet', async () => {
    prisma._internal.cards.push({ id: 'card-1', slug: 'card-1', name: 'Card One', active: true, resonanceTier: 2 });
    const all = await service.getAll();
    expect(all).toEqual([
      { cardId: 'card-1', slug: 'card-1', name: 'Card One', tier: 2, score: 0, boostPercent: 0, calculatedAt: undefined, scoreDelta: undefined },
    ]);
  });

  it('uses the latest snapshot once one exists', async () => {
    prisma._internal.cards.push({ id: 'card-1', slug: 'card-1', name: 'Card One', active: true, resonanceTier: 0 });
    prisma._internal.snapshots.push({
      cardId: 'card-1',
      score: 80,
      tier: 4,
      boostPercent: 8,
      calculatedAt: new Date('2026-08-01T00:00:00Z'),
    });

    const [view] = await service.getAll();
    expect(view).toMatchObject({ tier: 4, score: 80, boostPercent: 8 });
  });

  it('computes scoreDelta from the two most recent snapshots', async () => {
    prisma._internal.cards.push({ id: 'card-1', slug: 'card-1', name: 'Card One', active: true, resonanceTier: 0 });
    prisma._internal.snapshots.push(
      { cardId: 'card-1', score: 40, tier: 2, boostPercent: 4, calculatedAt: new Date('2026-08-01T00:00:00Z') },
      { cardId: 'card-1', score: 70, tier: 3, boostPercent: 6, calculatedAt: new Date('2026-08-02T00:00:00Z') },
    );

    const [view] = await service.getAll();
    expect(view!.score).toBe(70);
    expect(view!.scoreDelta).toBe(30);
  });

  it('excludes inactive cards', async () => {
    prisma._internal.cards.push({ id: 'card-1', slug: 'card-1', name: 'Inactive', active: false, resonanceTier: 5 });
    expect(await service.getAll()).toEqual([]);
  });

  describe('getTrending', () => {
    it('only returns cards with a positive score delta, sorted descending', async () => {
      prisma._internal.cards.push(
        { id: 'rising', slug: 'rising', name: 'Rising', active: true, resonanceTier: 0 },
        { id: 'falling', slug: 'falling', name: 'Falling', active: true, resonanceTier: 0 },
        { id: 'flat-new', slug: 'flat-new', name: 'FlatNew', active: true, resonanceTier: 0 },
      );
      prisma._internal.snapshots.push(
        { cardId: 'rising', score: 30, tier: 1, boostPercent: 2, calculatedAt: new Date('2026-08-01T00:00:00Z') },
        { cardId: 'rising', score: 90, tier: 5, boostPercent: 10, calculatedAt: new Date('2026-08-02T00:00:00Z') },
        { cardId: 'falling', score: 80, tier: 4, boostPercent: 8, calculatedAt: new Date('2026-08-01T00:00:00Z') },
        { cardId: 'falling', score: 20, tier: 1, boostPercent: 2, calculatedAt: new Date('2026-08-02T00:00:00Z') },
        // flat-new has only one snapshot -> no delta -> excluded from trending
        { cardId: 'flat-new', score: 50, tier: 2, boostPercent: 4, calculatedAt: new Date('2026-08-02T00:00:00Z') },
      );

      const trending = await service.getTrending();
      expect(trending).toHaveLength(1);
      expect(trending[0]!.cardId).toBe('rising');
    });
  });

  describe('buildBoostSnapshot', () => {
    it('only includes cards with a non-zero current tier', async () => {
      prisma._internal.cards.push(
        { id: 'boosted', slug: 'boosted', name: 'Boosted', active: true, resonanceTier: 0 },
        { id: 'zero-tier', slug: 'zero-tier', name: 'ZeroTier', active: true, resonanceTier: 0 },
      );
      prisma._internal.snapshots.push(
        { cardId: 'boosted', score: 65, tier: 3, boostPercent: 6, calculatedAt: new Date() },
        { cardId: 'zero-tier', score: 5, tier: 0, boostPercent: 0, calculatedAt: new Date() },
      );

      const snapshot = await service.buildBoostSnapshot();
      expect(snapshot).toEqual([{ cardId: 'boosted', tier: 3, boostPercent: 6 }]);
    });

    it('returns an empty snapshot when nothing has resonance data yet', async () => {
      prisma._internal.cards.push({ id: 'card-1', slug: 'card-1', name: 'Card', active: true, resonanceTier: 0 });
      expect(await service.buildBoostSnapshot()).toEqual([]);
    });
  });

  describe('getHistory', () => {
    it('returns snapshots within the requested window, oldest first', async () => {
      const now = Date.now();
      const day = 24 * 60 * 60 * 1000;
      prisma._internal.snapshots.push(
        { cardId: 'card-1', score: 10, tier: 1, boostPercent: 2, calculatedAt: new Date(now - 10 * day) }, // too old for 7d window
        { cardId: 'card-1', score: 40, tier: 2, boostPercent: 4, calculatedAt: new Date(now - 3 * day) },
        { cardId: 'card-1', score: 60, tier: 3, boostPercent: 6, calculatedAt: new Date(now - 1 * day) },
      );

      const history = await service.getHistory('card-1', 7);
      expect(history).toHaveLength(2);
      expect(history[0]!.score).toBe(40);
      expect(history[1]!.score).toBe(60);
    });
  });
});
