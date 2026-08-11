import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthService } from './auth.service';

/** AuthService only needs to know "was ensureStarterDecks called for this user" - the real
 * transactional behavior is covered by starter-deck-provisioning.service.spec.ts. */
function createFakeStarterDecks() {
  const calledForUserIds: string[] = [];
  return {
    calledForUserIds,
    ensureStarterDecks: vi.fn(async (userId: string) => {
      calledForUserIds.push(userId);
      return { provisioned: true, deckCount: 6 };
    }),
  };
}

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
      lastFindManyWhere: undefined as Record<string, unknown> | undefined,
      // Mirrors real Canonical Card Roster 1.0 shape: 40 active canonical cards, 23 archived
      // legacy cards (active: false), and 1 active token - so grantStarterCollection's real
      // Prisma `where` filter (active/isToken/isReferenceContent/rightsStatus) is exercised
      // against a realistic mix, not just recorded and ignored.
      rows: [
        ...Array.from({ length: 40 }, (_, i) => ({
          id: `canonical-${i}`,
          active: true,
          isToken: false,
          isReferenceContent: false,
          rightsStatus: 'placeholder',
        })),
        ...Array.from({ length: 23 }, (_, i) => ({
          id: `legacy-${i}`,
          active: false,
          isToken: false,
          isReferenceContent: false,
          rightsStatus: 'placeholder',
        })),
        { id: 'token-0', active: true, isToken: true, isReferenceContent: false, rightsStatus: 'placeholder' },
      ],
      async findMany({ where }: { where: Record<string, unknown> }) {
        this.lastFindManyWhere = where;
        return this.rows.filter((row: Record<string, unknown>) =>
          Object.entries(where).every(([key, value]) => {
            if (key === 'rightsStatus') {
              const cond = value as { not?: string };
              return cond.not === undefined || row[key] !== cond.not;
            }
            return row[key] === value;
          }),
        );
      },
    },
    collectionEntry: {
      lastCreateManyData: undefined as unknown[] | undefined,
      async createMany({ data }: { data: unknown[] }) {
        this.lastCreateManyData = data;
        return { count: data.length };
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
  let starterDecks: ReturnType<typeof createFakeStarterDecks>;
  let service: AuthService;

  beforeEach(() => {
    prisma = createFakePrisma();
    starterDecks = createFakeStarterDecks();
    const jwt = new JwtService({ secret: 'test-secret' });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    service = new AuthService(prisma as any, jwt, starterDecks as any);
  });

  it('provisions starter decks on registration', async () => {
    const result = await service.register('decks@kodraido.io', 'deckuser', 'super-secret-1');
    expect(starterDecks.calledForUserIds).toEqual([result.user.id]);
  });

  it('re-attempts starter deck provisioning on every login (idempotent no-op if already done)', async () => {
    const registered = await service.register('decklogin@kodraido.io', 'decklogin', 'super-secret-1');
    starterDecks.calledForUserIds.length = 0;
    await service.login('decklogin@kodraido.io', 'super-secret-1');
    expect(starterDecks.calledForUserIds).toEqual([registered.user.id]);
  });

  it('login succeeds even if starter deck provisioning throws', async () => {
    await service.register('deckfail@kodraido.io', 'deckfail', 'super-secret-1');
    starterDecks.ensureStarterDecks.mockRejectedValueOnce(new Error('boom'));
    const result = await service.login('deckfail@kodraido.io', 'super-secret-1');
    expect(result.accessToken).toBeTruthy();
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

  it('excludes tokens and reference-content cards from the starter collection grant', async () => {
    await service.register('starter@kodraido.io', 'starteruser', 'password123');
    expect(prisma.card.lastFindManyWhere).toMatchObject({
      isToken: false,
      isReferenceContent: false,
    });
  });

  /** Canonical Card Roster 1.0: a fresh account must receive exactly the 40 active Content Pack
   * 01 cards - never the 23 archived legacy cards, never the token. */
  it('grants a fresh account exactly 40 collectible cards, none of them archived legacy cards', async () => {
    await service.register('canonical@kodraido.io', 'canonicaluser', 'password123');
    expect(prisma.card.lastFindManyWhere).toMatchObject({ active: true });
    expect(prisma.collectionEntry.lastCreateManyData).toHaveLength(40);
    const grantedCardIds = (prisma.collectionEntry.lastCreateManyData as Array<{ cardId: string }>).map(
      (e) => e.cardId,
    );
    expect(grantedCardIds.every((id) => id.startsWith('canonical-'))).toBe(true);
    expect(grantedCardIds.some((id) => id.startsWith('legacy-'))).toBe(false);
    expect(grantedCardIds.some((id) => id.startsWith('token-'))).toBe(false);
  });

  it('logout revokes the refresh token', async () => {
    const registered = await service.register('logout@kodraido.io', 'logoutuser', 'password123');
    await service.logout(registered.refreshToken);
    await expect(service.refresh(registered.refreshToken)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });
});
