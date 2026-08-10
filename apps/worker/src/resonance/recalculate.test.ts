import { beforeEach, describe, expect, it } from 'vitest';
import { computeTrendInputs, recalculateAll, recalculateCard } from './recalculate.js';

interface FakeCard {
  id: string;
  active: boolean;
  linkedTrackIds: string[];
  resonanceTier: number;
}

interface FakeMediaAsset {
  id: string;
  linkedTrackId: string | null;
}

interface FakeMetricSnapshot {
  mediaAssetId: string;
  capturedAt: Date;
  views: number;
  listens: number;
  likes: number;
  comments: number;
  shares: number;
  soundUses: number;
  saves: number;
}

function createFakePrisma() {
  const cards: FakeCard[] = [];
  const mediaAssets: FakeMediaAsset[] = [];
  const metricSnapshots: FakeMetricSnapshot[] = [];
  const resonanceSnapshots: Array<{ cardId: string; score: number; tier: number; boostPercent: number }> = [];

  const api = {
    card: {
      async findUnique({ where }: { where: { id: string } }) {
        return cards.find((c) => c.id === where.id) ?? null;
      },
      async findMany({ where }: { where: { active: boolean; linkedTrackIds: { isEmpty: boolean } } }) {
        return cards.filter(
          (c) => c.active === where.active && (c.linkedTrackIds.length === 0) === where.linkedTrackIds.isEmpty,
        );
      },
      async update({ where, data }: { where: { id: string }; data: Partial<FakeCard> }) {
        const card = cards.find((c) => c.id === where.id)!;
        Object.assign(card, data);
        return card;
      },
    },
    mediaAsset: {
      async findMany({ where }: { where: { linkedTrackId: { in: string[] } } }) {
        return mediaAssets
          .filter((m) => m.linkedTrackId && where.linkedTrackId.in.includes(m.linkedTrackId))
          .map((m) => ({ id: m.id }));
      },
    },
    metricSnapshot: {
      async findMany({
        where,
      }: {
        where: { mediaAssetId: { in: string[] }; capturedAt: { gte: Date; lt: Date } };
      }) {
        return metricSnapshots.filter(
          (m) =>
            where.mediaAssetId.in.includes(m.mediaAssetId) &&
            m.capturedAt >= where.capturedAt.gte &&
            m.capturedAt < where.capturedAt.lt,
        );
      },
    },
    resonanceSnapshot: {
      async create({ data }: { data: { cardId: string; score: number; tier: number; boostPercent: number } }) {
        resonanceSnapshots.push(data);
        return data;
      },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async $transaction(fn: (tx: any) => Promise<void>) {
      return fn(api);
    },
    _internal: { cards, mediaAssets, metricSnapshots, resonanceSnapshots },
  };

  return api;
}

describe('computeTrendInputs', () => {
  it('converts raw metric totals into per-metric trend percentages', () => {
    const inputs = computeTrendInputs(
      { views: 0, listens: 200, likes: 150, comments: 130, shares: 160, soundUses: 120, saves: 0 },
      { views: 0, listens: 100, likes: 100, comments: 100, shares: 100, soundUses: 100, saves: 0 },
    );
    expect(inputs.listensTrend).toBe(100);
    expect(inputs.likesTrend).toBe(50);
    expect(inputs.commentsTrend).toBe(30);
    expect(inputs.sharesTrend).toBe(60);
    expect(inputs.soundUsesTrend).toBe(20);
  });
});

describe('recalculateCard', () => {
  let prisma: ReturnType<typeof createFakePrisma>;
  const now = new Date('2026-08-09T12:00:00Z');

  beforeEach(() => {
    prisma = createFakePrisma();
  });

  it('does nothing for a card with no linked tracks', async () => {
    prisma._internal.cards.push({ id: 'card-1', active: true, linkedTrackIds: [], resonanceTier: 0 });
    const didRecalculate = await recalculateCard(prisma as never, 'card-1', now);
    expect(didRecalculate).toBe(false);
    expect(prisma._internal.resonanceSnapshots).toHaveLength(0);
  });

  it('does nothing when linked tracks have no media assets', async () => {
    prisma._internal.cards.push({
      id: 'card-1',
      active: true,
      linkedTrackIds: ['track-1'],
      resonanceTier: 0,
    });
    const didRecalculate = await recalculateCard(prisma as never, 'card-1', now);
    expect(didRecalculate).toBe(false);
  });

  it('computes a high score/tier when metrics grew strongly in the last 7 days', async () => {
    prisma._internal.cards.push({
      id: 'card-1',
      active: true,
      linkedTrackIds: ['track-1'],
      resonanceTier: 0,
    });
    prisma._internal.mediaAssets.push({ id: 'asset-1', linkedTrackId: 'track-1' });

    const day = 24 * 60 * 60 * 1000;
    // Previous 7d window (14d-7d ago): modest baseline.
    prisma._internal.metricSnapshots.push({
      mediaAssetId: 'asset-1',
      capturedAt: new Date(now.getTime() - 10 * day),
      views: 0,
      listens: 100,
      likes: 100,
      comments: 100,
      shares: 100,
      soundUses: 100,
      saves: 0,
    });
    // Current 7d window: doubled everything.
    prisma._internal.metricSnapshots.push({
      mediaAssetId: 'asset-1',
      capturedAt: new Date(now.getTime() - 2 * day),
      views: 0,
      listens: 200,
      likes: 200,
      comments: 200,
      shares: 200,
      soundUses: 200,
      saves: 0,
    });

    const didRecalculate = await recalculateCard(prisma as never, 'card-1', now);
    expect(didRecalculate).toBe(true);
    expect(prisma._internal.resonanceSnapshots).toHaveLength(1);
    const snapshot = prisma._internal.resonanceSnapshots[0]!;
    expect(snapshot.score).toBe(100); // every metric doubled -> 100% trend on every weight
    expect(snapshot.tier).toBe(5);
    expect(snapshot.boostPercent).toBe(10);

    // Denormalized onto the card for the rest of the app (collection/deck builder/hand) to read.
    const card = prisma._internal.cards.find((c) => c.id === 'card-1')!;
    expect(card.resonanceTier).toBe(5);
  });

  it('scores a card with no prior activity as flat zero, not a crash', async () => {
    prisma._internal.cards.push({
      id: 'card-1',
      active: true,
      linkedTrackIds: ['track-1'],
      resonanceTier: 0,
    });
    prisma._internal.mediaAssets.push({ id: 'asset-1', linkedTrackId: 'track-1' });

    const didRecalculate = await recalculateCard(prisma as never, 'card-1', now);
    expect(didRecalculate).toBe(true);
    expect(prisma._internal.resonanceSnapshots[0]!.score).toBe(0);
    expect(prisma._internal.resonanceSnapshots[0]!.tier).toBe(0);
  });
});

describe('recalculateAll', () => {
  it('only recalculates active cards that have linked tracks, and reports how many it updated', async () => {
    const prisma = createFakePrisma();
    prisma._internal.cards.push(
      { id: 'card-with-track', active: true, linkedTrackIds: ['track-1'], resonanceTier: 0 },
      { id: 'card-inactive', active: false, linkedTrackIds: ['track-1'], resonanceTier: 0 },
      { id: 'card-no-track', active: true, linkedTrackIds: [], resonanceTier: 0 },
    );
    prisma._internal.mediaAssets.push({ id: 'asset-1', linkedTrackId: 'track-1' });

    const count = await recalculateAll(prisma as never);
    expect(count).toBe(1);
    expect(prisma._internal.resonanceSnapshots).toHaveLength(1);
    expect(prisma._internal.resonanceSnapshots[0]!.cardId).toBe('card-with-track');
  });
});
