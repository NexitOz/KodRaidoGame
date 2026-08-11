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

/**
 * True only for the specific unique-constraint violation on MatchReward's (matchId, userId) key -
 * never for an arbitrary P2002. A different unique violation (e.g. a real data-integrity bug
 * elsewhere) must propagate as a real error instead of being silently swallowed as "already
 * granted". Postgres/Prisma report the offending constraint either as an array of column names or
 * as the constraint name string depending on engine version, so both shapes are checked.
 */
function isMatchRewardUniqueViolation(error: unknown): boolean {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== 'P2002') return false;
  const target = error.meta?.target;
  if (Array.isArray(target)) {
    return target.includes('matchId') && target.includes('userId');
  }
  if (typeof target === 'string') {
    return target.includes('match_rewards') || (target.includes('matchId') && target.includes('userId'));
  }
  return false;
}

/**
 * Grants XP/soft-currency for a real (non-tutorial) match. Server-authoritative, idempotent, and
 * concurrency-safe:
 *
 * - Same match, called twice (refresh, retry, reconnect, a real race between two concurrent
 *   requests for the *same* matchId): the (matchId, userId) unique constraint on MatchReward is
 *   the atomic claim - this service always INSERTs that row before touching the user, so the
 *   loser of that race hits a unique-constraint violation and is treated as "already granted"
 *   without a second mutation.
 * - Two DIFFERENT matches finishing concurrently for the *same* account: the unique constraint
 *   above does nothing to protect this case - both transactions would otherwise read the same
 *   pre-reward User.xp/softCurrency/lastFirstWinBonusDate/highestRewardedLevel and each compute
 *   its reward against that same stale snapshot, silently discarding one of the two updates (a
 *   classic lost-update race). `SELECT ... FOR UPDATE` on the user row, taken as the very first
 *   statement of the transaction, closes this: it serializes reward transactions for the same
 *   account (never across different accounts - there is no global economy lock), so the second
 *   transaction's read only happens after the first has fully committed.
 *
 * See docs/player-progression-economy-01.md.
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
        // Row-level lock, held for the rest of this transaction - see the class doc comment for
        // why this is required and not just the MatchReward unique constraint.
        await tx.$queryRaw`SELECT id FROM "users" WHERE id = ${userId} FOR UPDATE`;

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
      if (isMatchRewardUniqueViolation(error)) {
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
