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
  tutorialStartedUsers: number;
  tutorialCompletedUsers: number;
  tutorialSkippedUsers: number;
  /** tutorialCompletedUsers / tutorialStartedUsers, 0 when nobody has started yet. */
  completionRate: number;
  /** Furthest tutorialStepReached value reached by users who started but neither completed nor
   * skipped - keyed by step index, e.g. { "0": 3, "4": 1 } means 3 users never got past step 0
   * and 1 user stalled after reaching step 4. */
  dropOffByStep: Record<number, number>;
  /** Users who completed or skipped the tutorial and went on to start a PvE match. */
  firstPvEAfterTutorial: number;
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

    const [totalUsers, newUsersLast7Days, matches, cardPlayedEvents, tutorialUsers, stepReachedEvents, firstPveStartedEvents] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.user.count({ where: { createdAt: { gte: since } } }),
        this.prisma.match.findMany({
          select: { status: true, player2IsBot: true, startedAt: true },
        }),
        this.prisma.matchEvent.findMany({
          where: { type: 'CARD_PLAYED' },
          select: { payloadJson: true },
        }),
        this.prisma.user.findMany({
          select: { id: true, tutorialStartedAt: true, tutorialCompletedAt: true, tutorialSkippedAt: true },
        }),
        this.prisma.analyticsEvent.findMany({
          where: { type: 'tutorialStepReached' },
          select: { userId: true, payloadJson: true },
        }),
        this.prisma.analyticsEvent.findMany({
          where: { type: 'firstPvEStarted' },
          select: { userId: true },
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

    const tutorialStartedUsers = tutorialUsers.filter((u) => u.tutorialStartedAt).length;
    const tutorialCompletedUsers = tutorialUsers.filter((u) => u.tutorialCompletedAt).length;
    const tutorialSkippedUsers = tutorialUsers.filter((u) => u.tutorialSkippedAt).length;
    const completionRate = tutorialStartedUsers > 0 ? tutorialCompletedUsers / tutorialStartedUsers : 0;

    const abandonedUserIds = new Set(
      tutorialUsers
        .filter((u) => u.tutorialStartedAt && !u.tutorialCompletedAt && !u.tutorialSkippedAt)
        .map((u) => u.id),
    );
    const maxStepByUser = new Map<string, number>();
    for (const event of stepReachedEvents) {
      if (!event.userId || !abandonedUserIds.has(event.userId)) continue;
      const payload = event.payloadJson as { step?: number };
      if (typeof payload.step !== 'number') continue;
      const current = maxStepByUser.get(event.userId) ?? 0;
      if (payload.step > current) maxStepByUser.set(event.userId, payload.step);
    }
    const dropOffByStep: Record<number, number> = {};
    for (const userId of abandonedUserIds) {
      const step = maxStepByUser.get(userId) ?? 0;
      dropOffByStep[step] = (dropOffByStep[step] ?? 0) + 1;
    }

    const firstPveStartedUserIds = new Set(
      firstPveStartedEvents.map((e) => e.userId).filter((id): id is string => Boolean(id)),
    );
    const firstPvEAfterTutorial = tutorialUsers.filter(
      (u) => (u.tutorialCompletedAt || u.tutorialSkippedAt) && firstPveStartedUserIds.has(u.id),
    ).length;

    return {
      totalUsers,
      newUsersLast7Days,
      totalMatches: matches.length,
      finishedMatches: finishedMatches.length,
      matchesByMode,
      matchesLast7Days,
      topCards,
      tutorialStartedUsers,
      tutorialCompletedUsers,
      tutorialSkippedUsers,
      completionRate,
      dropOffByStep,
      firstPvEAfterTutorial,
    };
  }
}
