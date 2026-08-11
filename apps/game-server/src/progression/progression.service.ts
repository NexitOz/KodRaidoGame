import { Injectable } from '@nestjs/common';
import {
  LEVEL_REWARDS,
  MAX_LEVEL,
  xpProgressForLevel,
  xpRequiredForLevel,
  type ProgressionView,
} from '@kod-raido/shared';
import { PrismaService } from '../prisma/prisma.service';

function utcDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Reusable, server-authoritative progression snapshot - see GET /me/progression. */
@Injectable()
export class ProgressionService {
  constructor(private readonly prisma: PrismaService) {}

  async getProgressionView(userId: string): Promise<ProgressionView> {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    const progress = xpProgressForLevel(user.xp);

    const [unlockedCosmetics, matches] = await Promise.all([
      this.prisma.userUnlock.count({ where: { userId, type: 'COSMETIC' } }),
      this.prisma.match.findMany({
        where: {
          OR: [{ player1Id: userId }, { player2Id: userId }],
          isTutorial: false,
          status: 'FINISHED',
        },
        select: { player1Id: true, player2Id: true, player2IsBot: true, winnerId: true },
      }),
    ]);

    let wins = 0;
    let losses = 0;
    let pveWins = 0;
    let pvpWins = 0;
    for (const m of matches) {
      if (m.winnerId === userId) {
        wins += 1;
        if (m.player2IsBot) pveWins += 1;
        else pvpWins += 1;
      } else if (m.winnerId) {
        losses += 1;
      }
      // m.winnerId === null is a draw - counted in neither wins nor losses.
    }
    const decided = wins + losses;
    const winRate = decided > 0 ? Math.round((wins / decided) * 100) : 0;

    return {
      level: progress.level,
      totalXp: user.xp,
      currentLevelXp: progress.currentLevelXp,
      nextLevelXp: progress.xpForNextLevel,
      progressPercent: progress.progressPercent,
      softCurrency: user.softCurrency,
      firstWinClaimedToday: user.lastFirstWinBonusDate === utcDateString(new Date()),
      nextReward: this.nextRewardPreview(progress.level, user.xp),
      unlockedCosmetics,
      stats: { wins, losses, winRate, pveWins, pvpWins },
    };
  }

  private nextRewardPreview(currentLevel: number, totalXp: number): ProgressionView['nextReward'] {
    for (let level = currentLevel + 1; level <= MAX_LEVEL; level += 1) {
      const def = LEVEL_REWARDS[level];
      if (!def) continue;
      return {
        level,
        xpNeeded: Math.max(0, xpRequiredForLevel(level) - totalXp),
        reward: def.type === 'CURRENCY' ? { level, type: 'CURRENCY', amount: def.amount } : { level, type: 'COSMETIC', key: def.key, label: def.label },
      };
    }
    return null;
  }
}
