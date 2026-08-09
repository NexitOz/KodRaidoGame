import { BadRequestException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AdminMetricsService } from './admin-metrics.service';

interface FakeTrack {
  id: string;
  slug: string;
}

interface FakeMediaAsset {
  id: string;
  provider: string;
  externalId: string;
  type: string;
  url: string;
  linkedTrackId?: string;
}

function createFakePrisma() {
  const tracks: FakeTrack[] = [{ id: 'track-1', slug: 'resonance-track' }];
  const mediaAssets: FakeMediaAsset[] = [];
  const metricSnapshots: Array<{ mediaAssetId: string; listens: number }> = [];
  let idCounter = 0;

  return {
    track: {
      async findUnique({ where }: { where: { slug: string } }) {
        return tracks.find((t) => t.slug === where.slug) ?? null;
      },
    },
    mediaAsset: {
      async upsert({
        where,
        create,
        update,
      }: {
        where: { provider_externalId: { provider: string; externalId: string } };
        create: Omit<FakeMediaAsset, 'id'>;
        update: Partial<FakeMediaAsset>;
      }) {
        const existing = mediaAssets.find(
          (m) =>
            m.provider === where.provider_externalId.provider &&
            m.externalId === where.provider_externalId.externalId,
        );
        if (existing) {
          Object.assign(existing, update);
          return existing;
        }
        idCounter += 1;
        const row: FakeMediaAsset = { id: `asset-${idCounter}`, ...create };
        mediaAssets.push(row);
        return row;
      },
    },
    metricSnapshot: {
      async create({ data }: { data: { mediaAssetId: string; listens: number } }) {
        metricSnapshots.push(data);
        return data;
      },
    },
    _internal: { tracks, mediaAssets, metricSnapshots },
  };
}

describe('AdminMetricsService', () => {
  let prisma: ReturnType<typeof createFakePrisma>;
  let resonanceQueue: { enqueueRecalculate: ReturnType<typeof vi.fn> };
  let service: AdminMetricsService;

  beforeEach(() => {
    prisma = createFakePrisma();
    resonanceQueue = { enqueueRecalculate: vi.fn().mockResolvedValue(undefined) };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    service = new AdminMetricsService(prisma as any, resonanceQueue as any);
  });

  it('creates a new media asset and metric snapshot for a fresh externalId', async () => {
    const csv = 'externalId,trackSlug,listens\nvid-1,resonance-track,500';
    const result = await service.importCsv(csv);

    expect(result).toEqual({ rowsImported: 1, mediaAssetsTouched: 1 });
    expect(prisma._internal.mediaAssets).toHaveLength(1);
    expect(prisma._internal.mediaAssets[0]).toMatchObject({
      provider: 'manual',
      externalId: 'vid-1',
      linkedTrackId: 'track-1',
    });
    expect(prisma._internal.metricSnapshots).toHaveLength(1);
    expect(prisma._internal.metricSnapshots[0]!.listens).toBe(500);
  });

  it('re-importing the same externalId updates the existing media asset instead of duplicating it', async () => {
    await service.importCsv('externalId,trackSlug,listens\nvid-1,resonance-track,500');
    await service.importCsv('externalId,trackSlug,listens\nvid-1,resonance-track,900');

    expect(prisma._internal.mediaAssets).toHaveLength(1);
    expect(prisma._internal.metricSnapshots).toHaveLength(2);
  });

  it('rejects an unknown track slug', async () => {
    await expect(
      service.importCsv('externalId,trackSlug\nvid-1,does-not-exist'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('enqueues a full resonance recalculation after a successful import', async () => {
    await service.importCsv('externalId,listens\nvid-1,10');
    expect(resonanceQueue.enqueueRecalculate).toHaveBeenCalledWith('ALL');
  });

  it('counts distinct media assets touched across multiple rows', async () => {
    const csv = ['externalId,listens', 'vid-1,10', 'vid-2,20', 'vid-1,15'].join('\n');
    const result = await service.importCsv(csv);
    expect(result.rowsImported).toBe(3);
    expect(result.mediaAssetsTouched).toBe(2);
  });
});
