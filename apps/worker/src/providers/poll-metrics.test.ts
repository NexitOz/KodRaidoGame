import { describe, expect, it } from 'vitest';
import { pollProviderMetrics } from './poll-metrics.js';
import type { MetricsProvider, ProviderMetrics } from './types.js';

interface FakeMediaAsset {
  id: string;
  provider: string;
  externalId: string;
}

function createFakePrisma() {
  const mediaAssets: FakeMediaAsset[] = [
    { id: 'asset-1', provider: 'youtube', externalId: 'yt1' },
    { id: 'asset-2', provider: 'youtube', externalId: 'yt2' },
    { id: 'asset-3', provider: 'vk', externalId: 'vk1' },
  ];
  const snapshots: Array<{ mediaAssetId: string } & ProviderMetrics> = [];

  return {
    prisma: {
      mediaAsset: {
        async findMany({ where }: { where: { provider: string } }) {
          return mediaAssets
            .filter((a) => a.provider === where.provider)
            .map((a) => ({ id: a.id, externalId: a.externalId }));
        },
      },
      metricSnapshot: {
        async create({ data }: { data: { mediaAssetId: string } & ProviderMetrics }) {
          snapshots.push(data);
          return data;
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
    snapshots,
  };
}

function fakeProvider(name: string, configured: boolean, impl: MetricsProvider['fetchMetrics']): MetricsProvider {
  return { name, isConfigured: () => configured, fetchMetrics: impl };
}

describe('pollProviderMetrics', () => {
  it('skips unconfigured providers entirely', async () => {
    const { prisma } = createFakePrisma();
    const results = await pollProviderMetrics(prisma, [
      fakeProvider('youtube', false, async () => {
        throw new Error('should not be called');
      }),
    ]);
    expect(results).toEqual([]);
  });

  it('writes a MetricSnapshot per asset for a configured provider', async () => {
    const { prisma, snapshots } = createFakePrisma();
    const results = await pollProviderMetrics(prisma, [
      fakeProvider('youtube', true, async (externalId) => ({
        views: externalId === 'yt1' ? 100 : 200,
        likes: 1,
        comments: 1,
        shares: 0,
        saves: 0,
        soundUses: 0,
      })),
    ]);

    expect(results).toEqual([{ provider: 'youtube', fetched: 2, failed: 0 }]);
    expect(snapshots).toHaveLength(2);
    expect(snapshots.map((s) => s.mediaAssetId).sort()).toEqual(['asset-1', 'asset-2']);
  });

  it('counts a per-asset failure without aborting the rest', async () => {
    const { prisma, snapshots } = createFakePrisma();
    const results = await pollProviderMetrics(prisma, [
      fakeProvider('youtube', true, async (externalId) => {
        if (externalId === 'yt1') throw new Error('boom');
        return { views: 1, likes: 0, comments: 0, shares: 0, saves: 0, soundUses: 0 };
      }),
    ]);

    expect(results).toEqual([{ provider: 'youtube', fetched: 1, failed: 1 }]);
    expect(snapshots).toHaveLength(1);
  });

  it('only touches assets belonging to that provider', async () => {
    const { prisma, snapshots } = createFakePrisma();
    await pollProviderMetrics(prisma, [
      fakeProvider('vk', true, async () => ({
        views: 5,
        likes: 0,
        comments: 0,
        shares: 0,
        saves: 0,
        soundUses: 0,
      })),
    ]);
    expect(snapshots).toEqual([expect.objectContaining({ mediaAssetId: 'asset-3' })]);
  });
});
