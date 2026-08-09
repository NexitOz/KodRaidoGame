import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ResonanceQueueService } from '../resonance/resonance-queue.service';
import { parseMetricsCsv } from './metrics-csv';

export interface MetricsImportResult {
  rowsImported: number;
  mediaAssetsTouched: number;
}

@Injectable()
export class AdminMetricsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly resonanceQueue: ResonanceQueueService,
  ) {}

  async importCsv(csv: string): Promise<MetricsImportResult> {
    const rows = parseMetricsCsv(csv);
    const touchedMediaAssetIds = new Set<string>();

    for (const row of rows) {
      let linkedTrackId: string | undefined;
      if (row.trackSlug) {
        const track = await this.prisma.track.findUnique({ where: { slug: row.trackSlug } });
        if (!track) {
          throw new BadRequestException(`Unknown track slug: "${row.trackSlug}".`);
        }
        linkedTrackId = track.id;
      }

      const mediaAsset = await this.prisma.mediaAsset.upsert({
        where: { provider_externalId: { provider: row.provider, externalId: row.externalId } },
        create: {
          provider: row.provider,
          externalId: row.externalId,
          type: row.type,
          url: row.url ?? `manual://${row.provider}/${row.externalId}`,
          linkedTrackId,
        },
        update: {
          type: row.type,
          ...(row.url ? { url: row.url } : {}),
          ...(linkedTrackId ? { linkedTrackId } : {}),
        },
      });

      await this.prisma.metricSnapshot.create({
        data: {
          mediaAssetId: mediaAsset.id,
          capturedAt: row.capturedAt,
          views: row.views,
          listens: row.listens,
          likes: row.likes,
          comments: row.comments,
          shares: row.shares,
          soundUses: row.soundUses,
          saves: row.saves,
        },
      });

      touchedMediaAssetIds.add(mediaAsset.id);
    }

    await this.resonanceQueue.enqueueRecalculate('ALL');

    return { rowsImported: rows.length, mediaAssetsTouched: touchedMediaAssetIds.size };
  }
}
