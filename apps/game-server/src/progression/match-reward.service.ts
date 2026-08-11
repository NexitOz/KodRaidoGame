import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  ECONOMY_VERSION,
  FIRST_WIN_OF_DAY_BONUS,
  LEVEL_REWARDS,
  levelForXp,
  rewardFor,
  xpProgressForLevel,
  type LevelRewardDef,
  type MatchMode,
  type MatchResult,
  type UnlockedRewardView,
} from '@kod-raido/shared';
import { PrismaService } from '../prisma/prisma.service';
import { AnalyticsEventsService } from '../analytics-events/analytics-events.service';

export interface GrantMatchRewardParams {
  userId: string;
  matchId: string;
  mode: MatchMode;
  result: MatchResult;
}

export interface MatchRewardResult {
  /** False when this exact (matchId, userId) reward had already been granted before this call -
   * a refresh/retry/reconnect/concurrent-duplicate. The numbers below still reflect the original
   * grant so the caller can safely re-display them, but nothing was mutated this time. */
  granted: boolean;
  xpGranted: number;
  softCurrencyGranted: number;
  firstWinBonus: boolean;
  previousLevel: number;
  newLevel: number;
  levelsGained: number;
  rewardsUnlocked: UnlockedRewardView[];
  currentLevelXp: number;
  nextLevelXp: number | null;
  progressPercent: number;
}

function utcDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function isUniqueConstraintViolation(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
}

/**
 * Grants XP/soft-currency for a real (non-tutorial) match. Server-authoritative, idempotent, and
 * concurrency-safe: the (matchId, userId) unique constraint on MatchReward is the atomic claim -
 * this service always INSERTs that row *before* touching User.xp/softCurrency/level, so a
 * duplicate call (page refresh re-POSTing a result, a reconnect, or a genuine race between two
 * concurrent requests for the same match) hits a unique-constraint violation and is treated as
 * "already granted" without a second mutation. See docs/player-progression-economy-01.md.
 */
@Injectable()
export class MatchRewardService {
  private readonly logger = new Logger(MatchRewardService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly analyticsEvents: AnalyticsEventsService,
  ) {}

  async grantMatchReward(params: GrantMatchRewardParams): Promise<MatchRewardResult> {
    const { userId, matchId, mode, result } = params;

    try {
      const granted = await this.prisma.$transaction(async (tx) => {
        const user = await tx.user.findUniqueOrThrow({ where: { id: userId } });

        const today = utcDateString(new Date());
        const firstWinBonus = result === 'WIN' && user.lastFirstWinBonusDate !== today;

        const base = rewardFor(mode, result);
        const xpGranted = base.xp + (firstWinBonus ? FIRST_WIN_OF_DAY_BONUS.xp : 0);
        const bonusCurrency = firstWinBonus ? FIRST_WIN_OF_DAY_BONUS.softCurrency : 0;

        const previousLevel = levelForXp(user.xp);
        const newXp = user.xp + xpGranted;
        const newLevel = levelForXp(newXp);

        // Atomic idempotency claim: this INSERT happens before any user mutation below. A
        // concurrent or retried call for the same (matchId, userId) throws a unique-constraint
        // violation here (caught outside the transaction) and never reaches the update.
        await tx.matchReward.create({
          data: {
            matchId,
            userId,
            mode,
            result,
            xpGranted,
            softCurrencyGranted: base.softCurrency + bonusCurrency,
            firstWinBonus,
            previousLevel,
            newLevel,
            economyVersion: ECONOMY_VERSION,
          },
        });

        // Lazy bootstrap: a null highestRewardedLevel means this account has never had a
        // level-up reward evaluated before. Treating `previousLevel` (this match's pre-reward
        // level) as the baseline means levels already reached before this system shipped are
        // never retroactively paid - only levels crossed by this and future matches are.
        const baselineLevel = user.highestRewardedLevel ?? previousLevel;
        const rewardsUnlocked: UnlockedRewardView[] = [];
        let unlockedCurrency = 0;
        for (let level = baselineLevel + 1; level <= newLevel; level += 1) {
          const def = LEVEL_REWARDS[level];
          if (!def) continue;
          const view = await this.applyLevelReward(tx, userId, level, def);
          rewardsUnlocked.push(view);
          if (view.type === 'CURRENCY') unlockedCurrency += view.amount;
        }

        await tx.user.update({
          where: { id: userId },
          data: {
            xp: newXp,
            level: newLevel,
            softCurrency: user.softCurrency + base.softCurrency + bonusCurrency + unlockedCurrency,
            lastFirstWinBonusDate: firstWinBonus ? today : user.lastFirstWinBonusDate,
            highestRewardedLevel: Math.max(baselineLevel, newLevel),
          },
        });

        const progress = xpProgressForLevel(newXp);

        return {
          granted: true,
          xpGranted,
          softCurrencyGranted: base.softCurrency + bonusCurrency,
          firstWinBonus,
          previousLevel,
          newLevel,
          levelsGained: newLevel - previousLevel,
          rewardsUnlocked,
          currentLevelXp: progress.currentLevelXp,
          nextLevelXp: progress.xpForNextLevel,
          progressPercent: progress.progressPercent,
        } satisfies MatchRewardResult;
      });

      await this.analyticsEvents.log('matchRewardGranted', userId, {
        mode,
        result,
        xpGranted: granted.xpGranted,
        currencyGranted: granted.softCurrencyGranted,
      });
      if (granted.firstWinBonus) {
        await this.analyticsEvents.log('firstWinOfDayGranted', userId, { mode });
      }
      if (granted.levelsGained > 0) {
        await this.analyticsEvents.log('levelUp', userId, {
          levelBefore: granted.previousLevel,
          levelAfter: granted.newLevel,
        });
      }
      for (const reward of granted.rewardsUnlocked) {
        await this.analyticsEvents.log('progressionRewardUnlocked', userId, {
          level: reward.level,
          type: reward.type,
        });
      }

      return granted;
    } catch (error) {
      if (isUniqueConstraintViolation(error)) {
        return this.loadExistingReward(matchId, userId);
      }
      throw error;
    }
  }

  private async applyLevelReward(
    tx: Prisma.TransactionClient,
    userId: string,
    level: number,
    def: LevelRewardDef,
  ): Promise<UnlockedRewardView> {
    if (def.type === 'CURRENCY') {
      return { level, type: 'CURRENCY', amount: def.amount };
    }
    await tx.userUnlock.upsert({
      where: { userId_key: { userId, key: def.key } },
      create: { userId, type: 'COSMETIC', key: def.key, source: 'LEVEL_UP' },
      update: {},
    });
    return { level, type: 'COSMETIC', key: def.key, label: def.label };
  }

  private async loadExistingReward(matchId: string, userId: string): Promise<MatchRewardResult> {
    const existing = await this.prisma.matchReward.findUnique({
      where: { matchId_userId: { matchId, userId } },
    });
    if (!existing) {
      // Unreachable in practice: a unique-constraint violation on (matchId, userId) guarantees a
      // row exists by the time we get here.
      throw new Error(
        `MatchReward not found for matchId=${matchId} userId=${userId} after a unique-constraint conflict.`,
      );
    }

    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    const progress = xpProgressForLevel(user.xp);

    this.logger.debug(`grantMatchReward: idempotent no-op for matchId=${matchId} userId=${userId}`);

    return {
      granted: false,
      xpGranted: existing.xpGranted,
      softCurrencyGranted: existing.softCurrencyGranted,
      firstWinBonus: existing.firstWinBonus,
      previousLevel: existing.previousLevel,
      newLevel: existing.newLevel,
      levelsGained: existing.newLevel - existing.previousLevel,
      // Not re-derived on an idempotent replay - the original call already reported them once.
      rewardsUnlocked: [],
      currentLevelXp: progress.currentLevelXp,
      nextLevelXp: progress.xpForNextLevel,
      progressPercent: progress.progressPercent,
    };
  }
}
