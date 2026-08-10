import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const LOOKBACK_MS = 7 * 24 * 60 * 60 * 1000;
const TOP_CARDS_LIMIT = 10;

export interface AnalyticsSummary {
  totalUsers: number;
  newUsersLast7Days: number;
  totalMatches: number;
  finishedMatches: number;
  matchesByMode: { pve: number; pvp: number };
  matchesLast7Days: number;
  topCards: Array<{ cardId: string; name: string; timesPlayed: number }>;
}

/**
 * Deliberately derives everything from data the rest of the app already
 * writes (User, Match, MatchEvent) rather than a separate event-tracking
 * pipeline — Phase 3/4 already persist every game event per finished match,
 * so "most-played card" is just an aggregation over CARD_PLAYED payloads,
 * not a new instrumentation surface to wire into every screen.
 */
@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(now: Date = new Date()): Promise<AnalyticsSummary> {
    const since = new Date(now.getTime() - LOOKBACK_MS);

    const [totalUsers, newUsersLast7Days, matches, cardPlayedEvents] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { createdAt: { gte: since } } }),
      this.prisma.match.findMany({
        select: { status: true, player2IsBot: true, startedAt: true },
      }),
      this.prisma.matchEvent.findMany({
        where: { type: 'CARD_PLAYED' },
        select: { payloadJson: true },
      }),
    ]);

    const finishedMatches = matches.filter((m) => m.status === 'FINISHED');
    const matchesByMode = { pve: 0, pvp: 0 };
    for (const match of finishedMatches) {
      if (match.player2IsBot) matchesByMode.pve += 1;
      else matchesByMode.pvp += 1;
    }
    const matchesLast7Days = matches.filter((m) => m.startedAt >= since).length;

    const playCounts = new Map<string, number>();
    for (const event of cardPlayedEvents) {
      const payload = event.payloadJson as { cardId?: string };
      if (!payload.cardId) continue;
      playCounts.set(payload.cardId, (playCounts.get(payload.cardId) ?? 0) + 1);
    }
    const topCardIds = [...playCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, TOP_CARDS_LIMIT)
      .map(([cardId]) => cardId);

    const cards =
      topCardIds.length > 0
        ? await this.prisma.card.findMany({
            where: { id: { in: topCardIds } },
            select: { id: true, name: true },
          })
        : [];
    const nameById = new Map(cards.map((c) => [c.id, c.name]));

    const topCards = topCardIds.map((cardId) => ({
      cardId,
      name: nameById.get(cardId) ?? 'Unknown card',
      timesPlayed: playCounts.get(cardId)!,
    }));

    return {
      totalUsers,
      newUsersLast7Days,
      totalMatches: matches.length,
      finishedMatches: finishedMatches.length,
      matchesByMode,
      matchesLast7Days,
      topCards,
    };
  }
}
