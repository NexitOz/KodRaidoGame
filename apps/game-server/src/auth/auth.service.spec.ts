import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { beforeEach, describe, expect, it } from 'vitest';
import { AuthService } from './auth.service';

interface FakeUserRow {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  level: number;
  xp: number;
  softCurrency: number;
  createdAt: Date;
  updatedAt: Date;
  avatarUrl: string | null;
}

interface FakeRefreshTokenRow {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  revokedAt: Date | null;
}

function createFakePrisma() {
  const users: FakeUserRow[] = [];
  const refreshTokens: FakeRefreshTokenRow[] = [];
  let idCounter = 0;
  const nextId = () => `id-${(idCounter += 1)}`;

  return {
    user: {
      async findFirst({ where }: { where: { OR: Array<{ email?: string; username?: string }> } }) {
        return (
          users.find((u) =>
            where.OR.some(
              (cond) =>
                (cond.email && u.email === cond.email) ||
                (cond.username && u.username === cond.username),
            ),
          ) ?? null
        );
      },
      async findUnique({ where }: { where: { email: string } }) {
        return users.find((u) => u.email === where.email) ?? null;
      },
      async create({ data }: { data: { email: string; username: string; passwordHash: string } }) {
        const row: FakeUserRow = {
          id: nextId(),
          email: data.email,
          username: data.username,
          passwordHash: data.passwordHash,
          level: 1,
          xp: 0,
          softCurrency: 500,
          createdAt: new Date(),
          updatedAt: new Date(),
          avatarUrl: null,
        };
        users.push(row);
        return row;
      },
    },
    card: {
      async findMany() {
        return [];
      },
    },
    collectionEntry: {
      async createMany() {
        return { count: 0 };
      },
    },
    refreshToken: {
      async create({ data }: { data: { userId: string; tokenHash: string; expiresAt: Date } }) {
        const row: FakeRefreshTokenRow = {
          id: nextId(),
          userId: data.userId,
          tokenHash: data.tokenHash,
          expiresAt: data.expiresAt,
          revokedAt: null,
        };
        refreshTokens.push(row);
        return row;
      },
      async findUnique({ where }: { where: { tokenHash: string } }) {
        const row = refreshTokens.find((t) => t.tokenHash === where.tokenHash);
        if (!row) return null;
        return { ...row, user: users.find((u) => u.id === row.userId) };
      },
      async update({ where, data }: { where: { id: string }; data: { revokedAt: Date } }) {
        const row = refreshTokens.find((t) => t.id === where.id);
        if (row) row.revokedAt = data.revokedAt;
        return row;
      },
    },
  };
}

describe('AuthService', () => {
  let prisma: ReturnType<typeof createFakePrisma>;
  let service: AuthService;

  beforeEach(() => {
    prisma = createFakePrisma();
    const jwt = new JwtService({ secret: 'test-secret' });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    service = new AuthService(prisma as any, jwt);
  });

  it('registers a new user and issues tokens', async () => {
    const result = await service.register('rider@kodraido.io', 'rider', 'super-secret-1');
    expect(result.user.email).toBe('rider@kodraido.io');
    expect(result.accessToken).toBeTruthy();
    expect(result.refreshToken).toBeTruthy();
  });

  it('rejects duplicate email registration', async () => {
    await service.register('dup@kodraido.io', 'dup1', 'super-secret-1');
    await expect(
      service.register('dup@kodraido.io', 'dup2', 'super-secret-2'),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('logs in with correct credentials and rejects incorrect ones', async () => {
    await service.register('login@kodraido.io', 'loginuser', 'correct-password');
    const result = await service.login('login@kodraido.io', 'correct-password');
    expect(result.accessToken).toBeTruthy();

    await expect(service.login('login@kodraido.io', 'wrong-password')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('rotates refresh tokens and rejects reuse of a consumed token', async () => {
    const registered = await service.register('refresh@kodraido.io', 'refreshuser', 'password123');
    const refreshed = await service.refresh(registered.refreshToken);
    expect(refreshed.refreshToken).not.toBe(registered.refreshToken);

    await expect(service.refresh(registered.refreshToken)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('logout revokes the refresh token', async () => {
    const registered = await service.register('logout@kodraido.io', 'logoutuser', 'password123');
    await service.logout(registered.refreshToken);
    await expect(service.refresh(registered.refreshToken)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });
});
