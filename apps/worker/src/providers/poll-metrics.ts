import type { PrismaClient } from '@prisma/client';
import type { MetricsProvider } from './types.js';

export interface PollResult {
  provider: string;
  fetched: number;
  failed: number;
}

/**
 * For each configured provider, refreshes metrics for every `MediaAsset`
 * already linked to it (created previously via admin CSV import or a prior
 * poll) and writes a fresh `MetricSnapshot`. Unconfigured providers
 * (missing API credentials) are skipped rather than failing the run — same
 * philosophy as the rest of Phase 6: a real official-API integration that
 * degrades to a no-op until credentials exist, not a stub that pretends to
 * work. One asset failing (deleted video, rate limit) doesn't abort the
 * others.
 */
export async function pollProviderMetrics(
  prisma: PrismaClient,
  providers: MetricsProvider[],
  now: Date = new Date(),
): Promise<PollResult[]> {
  const results: PollResult[] = [];

  for (const provider of providers) {
    if (!provider.isConfigured()) continue;

    const assets = await prisma.mediaAsset.findMany({
      where: { provider: provider.name },
      select: { id: true, externalId: true },
    });

    let fetched = 0;
    let failed = 0;

    for (const asset of assets) {
      try {
        const metrics = await provider.fetchMetrics(asset.externalId);
        await prisma.metricSnapshot.create({
          data: {
            mediaAssetId: asset.id,
            capturedAt: now,
            listens: 0,
            ...metrics,
          },
        });
        fetched += 1;
      } catch (error) {
        failed += 1;
        // eslint-disable-next-line no-console
        console.error(`[worker] ${provider.name} metrics fetch failed for ${asset.externalId}:`, error);
      }
    }

    results.push({ provider: provider.name, fetched, failed });
  }

  return results;
}
