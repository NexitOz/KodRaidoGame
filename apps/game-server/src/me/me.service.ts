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
      createdAt: user.createdAt.toISOString(),
    };
  }

  async getCollection(userId: string) {
    const entries = await this.prisma.collectionEntry.findMany({
      where: { userId, quantity: { gt: 0 } },
      include: { card: true },
    });
    return entries.map((entry) => ({
      quantity: entry.quantity,
      card: toCardDto(entry.card),
    }));
  }
}
