import { BadRequestException, Injectable } from '@nestjs/common';
import { TUTORIAL_REWARD } from '@kod-raido/shared';
import type {
  TutorialCompleteResponse,
  TutorialProgress,
  TutorialStartResponse,
} from '@kod-raido/shared';
import { computeLevelForXp } from '@kod-raido/shared';
import { AnalyticsEventsService } from '../analytics-events/analytics-events.service';
import { PrismaService } from '../prisma/prisma.service';
import { MatchesService } from '../matches/matches.service';

@Injectable()
export class TutorialService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly matches: MatchesService,
    private readonly analyticsEvents: AnalyticsEventsService,
  ) {}

  async getProgress(userId: string): Promise<TutorialProgress> {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    const activeMatch = await this.prisma.match.findFirst({
      where: { player1Id: userId, isTutorial: true, status: 'ACTIVE' },
      orderBy: { startedAt: 'desc' },
      select: { id: true },
    });

    return {
      startedAt: user.tutorialStartedAt?.toISOString(),
      completedAt: user.tutorialCompletedAt?.toISOString(),
      skippedAt: user.tutorialSkippedAt?.toISOString(),
      currentStep: user.tutorialCurrentStep,
      rewardClaimed: Boolean(user.tutorialRewardClaimedAt),
      activeMatchId: activeMatch?.id,
    };
  }

  /** Starts (or replays) the tutorial: creates a fresh deterministic tutorial match. */
  async start(userId: string): Promise<TutorialStartResponse> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { tutorialStartedAt: new Date(), tutorialCurrentStep: 0 },
    });
    await this.analyticsEvents.log('tutorialStarted', userId);

    const view = await this.matches.createTutorialMatch(userId);
    const progress = await this.getProgress(userId);
    return { ...progress, matchId: view.matchId };
  }

  /** Persists a client-driven resume bookmark. Never used to gate anything server-side. */
  async saveStep(userId: string, step: number): Promise<TutorialProgress> {
    await this.prisma.user.update({ where: { id: userId }, data: { tutorialCurrentStep: step } });
    await this.analyticsEvents.log('tutorialStepReached', userId, { step });
    return this.getProgress(userId);
  }

  /**
   * Server-authoritative completion: only grants the one-time reward after
   * confirming a real tutorial match row shows this user as the winner - the
   * client's claim that it "finished" is never trusted on its own.
   *
   * The reward claim itself is a conditional atomic update
   * (`UPDATE ... WHERE tutorialRewardClaimedAt IS NULL`), not a read-then-write: under Postgres's
   * default Read Committed isolation, a concurrent second UPDATE targeting the same row blocks
   * until the first transaction commits, then re-evaluates its own WHERE clause against the
   * now-committed row - so at most one concurrent `complete()` call can ever match and increment
   * xp/softCurrency, with zero reliance on an application-level read-before-transaction that
   * could go stale between the read and the write.
   */
  async complete(userId: string): Promise<TutorialCompleteResponse> {
    const wonMatch = await this.prisma.match.findFirst({
      where: { player1Id: userId, isTutorial: true, status: 'FINISHED', winnerId: userId },
      orderBy: { finishedAt: 'desc' },
    });
    if (!wonMatch) {
      throw new BadRequestException('No finished, won tutorial match found for this user.');
    }

    await this.analyticsEvents.log('tutorialCompleted', userId);

    return this.prisma.$transaction(async (tx) => {
      const claim = await tx.user.updateMany({
        where: { id: userId, tutorialRewardClaimedAt: null },
        data: {
          tutorialRewardClaimedAt: new Date(),
          tutorialCompletedAt: new Date(),
          xp: { increment: TUTORIAL_REWARD.xp },
          softCurrency: { increment: TUTORIAL_REWARD.softCurrency },
        },
      });

      if (claim.count === 0) {
        // Reward already claimed - by an earlier call or a concurrent one that just committed
        // first. tutorialCompletedAt still gets recorded for this (replay) completion.
        await tx.user.update({ where: { id: userId }, data: { tutorialCompletedAt: new Date() } });
        return { rewardGranted: false, xp: 0, softCurrency: 0 };
      }

      // Only the winner of the claim reaches here. Reads the just-incremented xp back within the
      // same transaction (a transaction always sees its own writes) so level is derived from the
      // real, freshly-persisted total - never from a value computed before the increment landed.
      const updated = await tx.user.findUniqueOrThrow({ where: { id: userId } });
      await tx.user.update({ where: { id: userId }, data: { level: computeLevelForXp(updated.xp) } });

      return { rewardGranted: true, xp: TUTORIAL_REWARD.xp, softCurrency: TUTORIAL_REWARD.softCurrency };
    });
  }

  async skip(userId: string): Promise<TutorialProgress> {
    await this.prisma.user.update({ where: { id: userId }, data: { tutorialSkippedAt: new Date() } });
    await this.analyticsEvents.log('tutorialSkipped', userId);
    return this.getProgress(userId);
  }
}
