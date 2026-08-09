import { BadRequestException, NotFoundException } from '@nestjs/common';
import type { GameEvent, MatchState } from '@kod-raido/game-engine';
import { beforeEach, describe, expect, it } from 'vitest';
import { BOT_DECKS } from './bot-decks';
import type { MatchActionDto } from './dto/match-action.dto';
import { MatchesService } from './matches.service';

interface FakeCardRow {
  id: string;
  slug: string;
  name: string;
  type: string;
  rarity: string;
  cost: number;
  tags: string[];
  attack: number | null;
  health: number | null;
  artworkUrl: string;
  abilityText: string | null;
  effectJson: unknown;
  linkedTrackIds: string[];
  boostProfileId: string | null;
  rightsStatus: string;
  rightsNote: string | null;
  source: string | null;
  licenseExpiresAt: Date | null;
  isPlayable: boolean;
  active: boolean;
  isToken: boolean;
  resonanceTier: number;
  universe: string | null;
  voiceStingerUrl: string | null;
  coverUrl: string | null;
  audioPreviewUrl: string | null;
  releaseUrl: string | null;
  releaseDate: Date | null;
  videoUrl: string | null;
}

function makeCardRow(id: string, overrides: Partial<FakeCardRow> = {}): FakeCardRow {
  return {
    id,
    slug: id,
    name: id,
    type: 'CHARACTER',
    rarity: 'COMMON',
    cost: 2,
    tags: [],
    attack: 2,
    health: 2,
    artworkUrl: '/p.png',
    abilityText: null,
    effectJson: [],
    linkedTrackIds: [],
    boostProfileId: null,
    rightsStatus: 'placeholder',
    rightsNote: null,
    source: null,
    licenseExpiresAt: null,
    isPlayable: true,
    active: true,
    isToken: false,
    resonanceTier: 0,
    universe: null,
    voiceStingerUrl: null,
    coverUrl: null,
    audioPreviewUrl: null,
    releaseUrl: null,
    releaseDate: null,
    videoUrl: null,
    ...overrides,
  };
}

const BOT_CARD_SLUGS = Array.from(
  new Set(Object.values(BOT_DECKS).flatMap((entries) => entries.map((e) => e.slug))),
);

function buildCardCatalog(): FakeCardRow[] {
  const botCards = BOT_CARD_SLUGS.map((slug, i) => {
    const cost = (i % 4) + 1;
    return makeCardRow(slug, { cost, attack: cost, health: cost + 1 });
  });
  const humanCards = Array.from({ length: 15 }, (_, i) =>
    makeCardRow(`human-${i}`, { cost: (i % 4) + 1, attack: 1, health: 1 }),
  );
  return [...botCards, ...humanCards];
}

interface FakeDeck {
  id: string;
  userId: string;
  cards: { cardId: string; quantity: number }[];
}

interface FakeUser {
  id: string;
  xp: number;
  softCurrency: number;
  level: number;
}

interface FakeMatch {
  id: string;
  player1Id: string;
  player2IsBot: boolean;
  botDifficulty: string | null;
  seed: string;
  status: string;
  winnerId: string | null;
  startedAt: Date;
  finishedAt: Date | null;
  xpAwarded: number | null;
  softCurrencyAwarded: number | null;
}

function createFakePrisma(cards: FakeCardRow[]) {
  const decks: FakeDeck[] = [];
  const matches: FakeMatch[] = [];
  const users = new Map<string, FakeUser>();
  const matchEvents: unknown[] = [];

  const api = {
    card: {
      async findMany() {
        return cards;
      },
    },
    deck: {
      async findUnique({ where }: { where: { id: string } }) {
        const deck = decks.find((d) => d.id === where.id);
        return deck ? { id: deck.id, userId: deck.userId, cards: deck.cards } : null;
      },
    },
    match: {
      async create({ data }: { data: Omit<FakeMatch, 'winnerId' | 'startedAt' | 'finishedAt' | 'xpAwarded' | 'softCurrencyAwarded'> }) {
        const row: FakeMatch = {
          ...data,
          winnerId: null,
          startedAt: new Date(),
          finishedAt: null,
          xpAwarded: null,
          softCurrencyAwarded: null,
        };
        matches.push(row);
        return row;
      },
      async findUnique({ where }: { where: { id: string } }) {
        return matches.find((m) => m.id === where.id) ?? null;
      },
      async update({ where, data }: { where: { id: string }; data: Partial<FakeMatch> }) {
        const row = matches.find((m) => m.id === where.id)!;
        Object.assign(row, data);
        return row;
      },
      async findMany({ where, take }: { where: { player1Id: string }; take?: number }) {
        return matches
          .filter((m) => m.player1Id === where.player1Id)
          .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())
          .slice(0, take ?? matches.length);
      },
    },
    matchEvent: {
      async createMany({ data }: { data: unknown[] }) {
        matchEvents.push(...data);
        return { count: data.length };
      },
    },
    user: {
      async findUniqueOrThrow({ where }: { where: { id: string } }) {
        const user = users.get(where.id);
        if (!user) throw new Error('user not found');
        return user;
      },
      async update({ where, data }: { where: { id: string }; data: Partial<FakeUser> }) {
        const user = users.get(where.id)!;
        Object.assign(user, data);
        return user;
      },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async $transaction<T>(fn: (tx: any) => Promise<T>): Promise<T> {
      return fn(api);
    },
    _internal: { decks, matches, users, matchEvents },
  };

  return api;
}

class FakeMatchStateRepository {
  private states = new Map<string, MatchState>();
  private owners = new Map<string, string>();
  private events = new Map<string, GameEvent[]>();

  async save(matchId: string, state: MatchState, humanPlayerId: string): Promise<void> {
    this.states.set(matchId, state);
    this.owners.set(matchId, humanPlayerId);
  }

  async load(matchId: string): Promise<MatchState | null> {
    return this.states.get(matchId) ?? null;
  }

  async getOwner(matchId: string): Promise<string | null> {
    return this.owners.get(matchId) ?? null;
  }

  async appendEvents(matchId: string, events: GameEvent[]): Promise<void> {
    if (events.length === 0) return;
    const existing = this.events.get(matchId) ?? [];
    this.events.set(matchId, [...existing, ...events]);
  }

  async loadAllEvents(matchId: string): Promise<GameEvent[]> {
    return this.events.get(matchId) ?? [];
  }

  async delete(matchId: string): Promise<void> {
    this.states.delete(matchId);
    this.owners.delete(matchId);
    this.events.delete(matchId);
  }
}

function endTurn(): MatchActionDto {
  return { type: 'END_TURN' };
}

async function playToFinish(service: MatchesService, userId: string, matchId: string) {
  let result = await service.applyPlayerAction(userId, matchId, endTurn());
  let guard = 0;
  while (!result.view.finished && guard < 100) {
    guard += 1;
    result = await service.applyPlayerAction(userId, matchId, endTurn());
  }
  return result;
}

describe('MatchesService', () => {
  let prisma: ReturnType<typeof createFakePrisma>;
  let repo: FakeMatchStateRepository;
  let service: MatchesService;

  beforeEach(() => {
    const cards = buildCardCatalog();
    prisma = createFakePrisma(cards);
    repo = new FakeMatchStateRepository();
    prisma._internal.users.set('user-1', { id: 'user-1', xp: 0, softCurrency: 0, level: 1 });
    prisma._internal.decks.push({
      id: 'deck-1',
      userId: 'user-1',
      cards: Array.from({ length: 15 }, (_, i) => ({ cardId: `human-${i}`, quantity: 2 })),
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    service = new MatchesService(prisma as any, repo as any);
  });

  it('creates a PvE match against a random bot deck for a valid 30-card deck', async () => {
    const view = await service.createPveMatch('user-1', 'deck-1', 'NORMAL');
    expect(view.you.playerId).toBe('user-1');
    expect(view.opponent.isBot).toBe(true);
    expect(view.finished).toBe(false);
  });

  it('rejects a deck that does not total 30 cards', async () => {
    prisma._internal.decks.push({
      id: 'deck-short',
      userId: 'user-1',
      cards: [{ cardId: 'human-0', quantity: 2 }],
    });
    await expect(service.createPveMatch('user-1', 'deck-short', 'NORMAL')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('throws NotFoundException for a deck the user does not own', async () => {
    await expect(service.createPveMatch('user-2', 'deck-1', 'NORMAL')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('redacts the opponent hand from the match view', async () => {
    const view = await service.createPveMatch('user-1', 'deck-1', 'NORMAL');
    expect(view.opponent.hand).toEqual([]);
    expect(view.opponent.handCount).toBeGreaterThan(0);
  });

  it('drives the bot turn automatically and returns control to the human (or finishes)', async () => {
    const view = await service.createPveMatch('user-1', 'deck-1', 'NORMAL');
    const result = await service.applyPlayerAction('user-1', view.matchId, endTurn());
    expect(result.view.finished || result.view.activePlayerId === 'user-1').toBe(true);
  });

  it('rejects actions from a user who does not own the match', async () => {
    const view = await service.createPveMatch('user-1', 'deck-1', 'NORMAL');
    await expect(
      service.applyPlayerAction('user-2', view.matchId, endTurn()),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('rejects an illegal action', async () => {
    const view = await service.createPveMatch('user-1', 'deck-1', 'NORMAL');
    await expect(
      service.applyPlayerAction('user-1', view.matchId, {
        type: 'PLAY_CARD',
        cardId: 'not-in-hand',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('finishes the match, awards rewards, updates user xp, and clears the redis state', async () => {
    const view = await service.createPveMatch('user-1', 'deck-1', 'NORMAL');
    const result = await playToFinish(service, 'user-1', view.matchId);

    expect(result.view.finished).toBe(true);
    expect(result.rewards).toBeDefined();
    expect(result.rewards!.xp).toBeGreaterThan(0);

    const user = prisma._internal.users.get('user-1')!;
    expect(user.xp).toBe(result.rewards!.xp);
    expect(await repo.getOwner(view.matchId)).toBeNull();
  });

  it('lists match history with the finished result after a match ends', async () => {
    const view = await service.createPveMatch('user-1', 'deck-1', 'NORMAL');
    await playToFinish(service, 'user-1', view.matchId);

    const history = await service.listHistory('user-1');
    expect(history).toHaveLength(1);
    expect(history[0]!.status).toBe('FINISHED');
    expect(typeof history[0]!.won).toBe('boolean');
  });
});
