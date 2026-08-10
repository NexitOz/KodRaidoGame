import { Injectable } from '@nestjs/common';
import type { BoostSnapshotEntry, CardResonanceView, ResonanceHistoryPoint, ResonanceTier } from '@kod-raido/shared';
import { PrismaService } from '../prisma/prisma.service';

const TRENDING_LIMIT = 10;

interface SnapshotRow {
  score: number;
  tier: number;
  boostPercent: number;
  calculatedAt: Date;
}

@Injectable()
export class ResonanceService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(): Promise<CardResonanceView[]> {
    const cards = await this.prisma.card.findMany({
      where: { active: true },
      select: { id: true, slug: true, name: true, resonanceTier: true },
      orderBy: { name: 'asc' },
    });
    const latestTwoByCard = await this.getLatestTwoByCard(cards.map((c) => c.id));

    return cards.map((card) => this.toView(card, latestTwoByCard.get(card.id) ?? []));
  }

  async getTrending(limit = TRENDING_LIMIT): Promise<CardResonanceView[]> {
    const all = await this.getAll();
    return all
      .filter((card) => (card.scoreDelta ?? 0) > 0)
      .sort((a, b) => (b.scoreDelta ?? 0) - (a.scoreDelta ?? 0))
      .slice(0, limit);
  }

  async getHistory(cardId: string, days = 7): Promise<ResonanceHistoryPoint[]> {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const rows = await this.prisma.resonanceSnapshot.findMany({
      where: { cardId, calculatedAt: { gte: since } },
      orderBy: { calculatedAt: 'asc' },
    });
    return rows.map((row) => ({
      score: row.score,
      tier: row.tier as ResonanceTier,
      calculatedAt: row.calculatedAt.toISOString(),
    }));
  }

  /**
   * Frozen at match creation so a card's power can't shift mid-match just
   * because someone's TikTok blew up between turns — only cards with an
   * actual (non-zero-tier) snapshot are included to keep the payload small.
   */
  async buildBoostSnapshot(): Promise<BoostSnapshotEntry[]> {
    const cards = await this.prisma.card.findMany({
      where: { active: true },
      select: { id: true },
    });
    const latestTwoByCard = await this.getLatestTwoByCard(cards.map((c) => c.id));

    const entries: BoostSnapshotEntry[] = [];
    for (const [cardId, snapshots] of latestTwoByCard) {
      const latest = snapshots[0];
      if (latest && latest.tier > 0) {
        entries.push({ cardId, tier: latest.tier, boostPercent: latest.boostPercent });
      }
    }
    return entries;
  }

  private async getLatestTwoByCard(cardIds: string[]): Promise<Map<string, SnapshotRow[]>> {
    if (cardIds.length === 0) return new Map();

    const rows = await this.prisma.resonanceSnapshot.findMany({
      where: { cardId: { in: cardIds } },
      orderBy: { calculatedAt: 'desc' },
      select: { cardId: true, score: true, tier: true, boostPercent: true, calculatedAt: true },
    });

    const map = new Map<string, SnapshotRow[]>();
    for (const row of rows) {
      const list = map.get(row.cardId) ?? [];
      if (list.length < 2) {
        list.push(row);
        map.set(row.cardId, list);
      }
    }
    return map;
  }

  private toView(
    card: { id: string; slug: string; name: string; resonanceTier: number },
    snapshots: SnapshotRow[],
  ): CardResonanceView {
    const [latest, previous] = snapshots;
    return {
      cardId: card.id,
      slug: card.slug,
      name: card.name,
      tier: (latest?.tier ?? card.resonanceTier) as ResonanceTier,
      score: latest?.score ?? 0,
      boostPercent: latest?.boostPercent ?? 0,
      calculatedAt: latest?.calculatedAt.toISOString(),
      scoreDelta: latest && previous ? Math.round((latest.score - previous.score) * 100) / 100 : undefined,
    };
  }
}
