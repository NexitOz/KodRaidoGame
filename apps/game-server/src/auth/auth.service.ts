import { ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { STARTER_CARD_QUANTITY } from '@kod-raido/shared';
import type { User } from '@prisma/client';
import * as argon2 from 'argon2';
import { createHash, randomUUID } from 'node:crypto';
import { StarterDeckProvisioningService } from '../decks/starter-deck-provisioning.service';
import { PrismaService } from '../prisma/prisma.service';

const ACCESS_TOKEN_TTL_SECONDS = 15 * 60;
const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export interface AuthResult {
  user: User;
  accessToken: string;
  accessTokenExpiresAt: Date;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
}

function hashRefreshToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly starterDecks: StarterDeckProvisioningService,
  ) {}

  async register(email: string, username: string, password: string): Promise<AuthResult> {
    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });
    if (existing) {
      throw new ConflictException('Email or username already in use.');
    }

    const passwordHash = await argon2.hash(password);
    const user = await this.prisma.user.create({ data: { email, username, passwordHash } });
    await this.grantStarterCollection(user.id);
    // Unguarded like grantStarterCollection above - a fresh account that can't be provisioned
    // (e.g. an unseeded database) is a setup problem worth surfacing immediately, not one to
    // silently swallow.
    await this.starterDecks.ensureStarterDecks(user.id);

    return this.issueTokens(user);
  }

  async login(email: string, password: string): Promise<AuthResult> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials.');

    const valid = await argon2.verify(user.passwordHash, password);
    if (!valid) throw new UnauthorizedException('Invalid credentials.');

    // Backfill for accounts created before Starter Deck Provisioning 1.0 - idempotent (a no-op
    // once already provisioned), so this stays cheap on every login. Deliberately non-fatal:
    // a provisioning hiccup must never lock an existing user out of their own account.
    try {
      await this.starterDecks.ensureStarterDecks(user.id);
    } catch (error) {
      this.logger.error(`ensureStarterDecks failed for user ${user.id} during login`, error as Error);
    }

    return this.issueTokens(user);
  }

  async refresh(refreshToken: string): Promise<AuthResult> {
    const stored = await this.prisma.refreshToken.findUnique({
      where: { tokenHash: hashRefreshToken(refreshToken) },
      include: { user: true },
    });

    if (!stored || stored.revokedAt || stored.expiresAt.getTime() < Date.now()) {
      throw new UnauthorizedException('Invalid refresh token.');
    }

    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });

    return this.issueTokens(stored.user);
  }

  async logout(refreshToken: string): Promise<void> {
    const stored = await this.prisma.refreshToken.findUnique({
      where: { tokenHash: hashRefreshToken(refreshToken) },
    });
    if (stored && !stored.revokedAt) {
      await this.prisma.refreshToken.update({
        where: { id: stored.id },
        data: { revokedAt: new Date() },
      });
    }
  }

  private async grantStarterCollection(userId: string): Promise<void> {
    // Tokens aren't collectible (summon-only) and reference/dev content is never granted
    // to real users regardless of REFERENCE_CONTENT_ENABLED - see cards.service.ts.
    const starterCards = await this.prisma.card.findMany({
      where: {
        active: true,
        rightsStatus: { not: 'blocked' },
        isToken: false,
        isReferenceContent: false,
      },
      select: { id: true },
    });
    if (starterCards.length === 0) return;

    await this.prisma.collectionEntry.createMany({
      data: starterCards.map((card) => ({
        userId,
        cardId: card.id,
        quantity: STARTER_CARD_QUANTITY,
      })),
      skipDuplicates: true,
    });
  }

  private async issueTokens(user: User): Promise<AuthResult> {
    const accessToken = await this.jwt.signAsync(
      { sub: user.id, email: user.email, username: user.username },
      { expiresIn: ACCESS_TOKEN_TTL_SECONDS },
    );

    const refreshToken = `${randomUUID()}${randomUUID()}`;
    const refreshTokenExpiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: hashRefreshToken(refreshToken),
        expiresAt: refreshTokenExpiresAt,
      },
    });

    return {
      user,
      accessToken,
      accessTokenExpiresAt: new Date(Date.now() + ACCESS_TOKEN_TTL_SECONDS * 1000),
      refreshToken,
      refreshTokenExpiresAt,
    };
  }
}
