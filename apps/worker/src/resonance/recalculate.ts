import type { PrismaClient } from '@prisma/client';
import {
  computeResonanceScore,
  computeTrendPercent,
  RANKED_BOOST_PERCENT_BY_TIER,
  tierFromScore,
  type ResonanceScoreInputs,
} from '@kod-raido/shared';

const PRIMARY_WINDOW_MS = 7 * 24 * 60 * 60 * 1000; // rolling 7-day window drives the score
const SNAPSHOT_VALIDITY_MS = 24 * 60 * 60 * 1000; // re-checked at least daily

export interface MetricTotals {
  views: number;
  listens: number;
  likes: number;
  comments: number;
  shares: number;
  soundUses: number;
  saves: number;
}

const ZERO_TOTALS: MetricTotals = {
  views: 0,
  listens: 0,
  likes: 0,
  comments: 0,
  shares: 0,
  soundUses: 0,
  saves: 0,
};

export function computeTrendInputs(
  current: MetricTotals,
  previous: MetricTotals,
): ResonanceScoreInputs {
  return {
    listensTrend: computeTrendPercent(current.listens, previous.listens),
    likesTrend: computeTrendPercent(current.likes, previous.likes),
    commentsTrend: computeTrendPercent(current.comments, previous.comments),
    sharesTrend: computeTrendPercent(current.shares, previous.shares),
    soundUsesTrend: computeTrendPercent(current.soundUses, previous.soundUses),
  };
}

async function sumMetrics(
  prisma: PrismaClient,
  mediaAssetIds: string[],
  from: Date,
  to: Date,
): Promise<MetricTotals> {
  const rows = await prisma.metricSnapshot.findMany({
    where: { mediaAssetId: { in: mediaAssetIds }, capturedAt: { gte: from, lt: to } },
  });
  return rows.reduce<MetricTotals>(
    (acc, row) => ({
      views: acc.views + row.views,
      listens: acc.listens + row.listens,
      likes: acc.likes + row.likes,
      comments: acc.comments + row.comments,
      shares: acc.shares + row.shares,
      soundUses: acc.soundUses + row.soundUses,
      saves: acc.saves + row.saves,
    }),
    ZERO_TOTALS,
  );
}

/**
 * Recalculates one card's Resonance score from the tracks it's linked to.
 * Compares the trailing 7-day window of metrics against the 7 days before
 * that (rolling 7d, per spec section 5.4), writes a new ResonanceSnapshot
 * row (history for the /resonance page), and denormalizes the resulting
 * tier onto Card.resonanceTier so every other screen that already reads
 * that field (collection, deck builder, hand) picks it up for free.
 * Returns false (no-op) for cards with nothing to score against.
 */
export async function recalculateCard(
  prisma: PrismaClient,
  cardId: string,
  now: Date = new Date(),
): Promise<boolean> {
  const card = await prisma.card.findUnique({ where: { id: cardId } });
  if (!card || card.linkedTrackIds.length === 0) return false;

  const mediaAssets = await prisma.mediaAsset.findMany({
    where: { linkedTrackId: { in: card.linkedTrackIds } },
    select: { id: true },
  });
  const mediaAssetIds = mediaAssets.map((m) => m.id);
  if (mediaAssetIds.length === 0) return false;

  const windowStart = new Date(now.getTime() - PRIMARY_WINDOW_MS);
  const previousWindowStart = new Date(now.getTime() - 2 * PRIMARY_WINDOW_MS);

  const [current, previous] = await Promise.all([
    sumMetrics(prisma, mediaAssetIds, windowStart, now),
    sumMetrics(prisma, mediaAssetIds, previousWindowStart, windowStart),
  ]);

  const inputs = computeTrendInputs(current, previous);
  const score = computeResonanceScore(inputs);
  const tier = tierFromScore(score);
  const boostPercent = RANKED_BOOST_PERCENT_BY_TIER[tier];

  await prisma.$transaction(async (tx) => {
    await tx.resonanceSnapshot.create({
      data: {
        cardId,
        score,
        tier,
        boostPercent,
        validUntil: new Date(now.getTime() + SNAPSHOT_VALIDITY_MS),
        reasonsJson: inputs as object,
      },
    });
    await tx.card.update({ where: { id: cardId }, data: { resonanceTier: tier } });
  });

  return true;
}

export async function recalculateAll(prisma: PrismaClient, now: Date = new Date()): Promise<number> {
  const cards = await prisma.card.findMany({
    where: { active: true, linkedTrackIds: { isEmpty: false } },
    select: { id: true },
  });

  let recalculated = 0;
  for (const card of cards) {
    const didRecalculate = await recalculateCard(prisma, card.id, now);
    if (didRecalculate) recalculated += 1;
  }
  return recalculated;
}
