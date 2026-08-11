import { Injectable, NotFoundException } from '@nestjs/common';
import { toCardDto } from '../cards/cards.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MeService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found.');
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      avatarUrl: user.avatarUrl ?? undefined,
      level: user.level,
      xp: user.xp,
      softCurrency: user.softCurrency,
      mmr: user.mmr,
      createdAt: user.createdAt.toISOString(),
    };
  }

  /**
   * Canonical Card Roster 1.0: excludes archived (active: false) legacy cards, same gate as
   * CardsService.findAllPlayable/AuthService.grantStarterCollection - a pre-existing account that
   * still holds a CollectionEntry for a now-archived card (none do today, but the invariant should
   * hold regardless of how that entry got created) must not see it in Collection.
   */
  async getCollection(userId: string) {
    const entries = await this.prisma.collectionEntry.findMany({
      where: { userId, quantity: { gt: 0 }, card: { active: true } },
      include: { card: true },
    });
    return entries.map((entry) => ({
      quantity: entry.quantity,
      card: toCardDto(entry.card),
    }));
  }
}
