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
   */
  async complete(userId: string): Promise<TutorialCompleteResponse> {
    const wonMatch = await this.prisma.match.findFirst({
      where: { player1Id: userId, isTutorial: true, status: 'FINISHED', winnerId: userId },
      orderBy: { finishedAt: 'desc' },
    });
    if (!wonMatch) {
      throw new BadRequestException('No finished, won tutorial match found for this user.');
    }

    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    await this.analyticsEvents.log('tutorialCompleted', userId);

    if (user.tutorialRewardClaimedAt) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { tutorialCompletedAt: new Date() },
      });
      return { rewardGranted: false, xp: 0, softCurrency: 0 };
    }

    await this.prisma.$transaction(async (tx) => {
      const newXp = user.xp + TUTORIAL_REWARD.xp;
      const newLevel = computeLevelForXp(newXp);
      await tx.user.update({
        where: { id: userId },
        data: {
          xp: newXp,
          softCurrency: user.softCurrency + TUTORIAL_REWARD.softCurrency,
          level: newLevel,
          tutorialCompletedAt: new Date(),
          tutorialRewardClaimedAt: new Date(),
        },
      });
    });

    return { rewardGranted: true, xp: TUTORIAL_REWARD.xp, softCurrency: TUTORIAL_REWARD.softCurrency };
  }

  async skip(userId: string): Promise<TutorialProgress> {
    await this.prisma.user.update({ where: { id: userId }, data: { tutorialSkippedAt: new Date() } });
    await this.analyticsEvents.log('tutorialSkipped', userId);
    return this.getProgress(userId);
  }
}
