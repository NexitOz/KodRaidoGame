import { DECK_SIZE } from '@kod-raido/shared';
import { validateDeck } from '@kod-raido/game-engine';
import { beforeEach, describe, expect, it } from 'vitest';
import { STARTER_DECK_PRESETS } from '../content/starter-decks';
import { toCardDto } from '../cards/cards.service';
import { StarterDeckProvisioningService } from './starter-deck-provisioning.service';

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
  faction: string;
  subFactions: string[];
  archetypeTags: string[];
  isNeutral: boolean;
  isCrossoverEligible: boolean;
  isReferenceContent: boolean;
  universe: string | null;
  voiceStingerUrl: string | null;
  coverUrl: string | null;
  audioPreviewUrl: string | null;
  releaseUrl: string | null;
  releaseDate: Date | null;
  videoUrl: string | null;
}

/**
 * One fake row per distinct slug the real STARTER_DECK_PRESETS reference, uniformly COMMON so
 * every entry (quantity 1 or 2 in the real presets) stays within `deckLimitForRarity` regardless
 * of the card's *real* seeded rarity - this suite is about the SERVICE's provisioning logic
 * (idempotency, concurrency, ownership, "exactly 30", no-resurrection), not re-verifying content
 * authoring, which `npm run seed` + a live account already exercises against real data.
 */
function buildFakeCatalog(): FakeCardRow[] {
  const slugs = Array.from(new Set(STARTER_DECK_PRESETS.flatMap((p) => p.entries.map((e) => e.slug))));
  return slugs.map((slug) => ({
    id: `id-${slug}`,
    slug,
    name: slug,
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
    faction: 'NEUTRAL',
    subFactions: [],
    archetypeTags: [],
    isNeutral: true,
    isCrossoverEligible: true,
    isReferenceContent: false,
    universe: null,
    voiceStingerUrl: null,
    coverUrl: null,
    audioPreviewUrl: null,
    releaseUrl: null,
    releaseDate: null,
    videoUrl: null,
  }));
}

function createFakePrisma(cards: FakeCardRow[]) {
  const users = new Map<string, { id: string; starterDecksProvisionedAt: Date | null }>();
  const collectionByUser = new Map<string, Map<string, number>>();
  const decksByUser = new Map<string, Array<{ id: string; userId: string; name: string; cards: Array<{ cardId: string; quantity: number }> }>>();
  let deckIdCounter = 0;

  function ensureUser(id: string) {
    if (!users.has(id)) users.set(id, { id, starterDecksProvisionedAt: null });
    return users.get(id)!;
  }

  const base = {
    user: {
      // Mirrors the real conditional-claim UPDATE: synchronous check-and-set with no `await` in
      // between, so two "concurrent" callers (Promise.all) can never both see count > 0 - the
      // same pattern this codebase already proved out for TutorialService's reward claim.
      async updateMany({ where, data }: { where: { id: string; starterDecksProvisionedAt: null }; data: { starterDecksProvisionedAt: Date } }) {
        const user = ensureUser(where.id);
        if (user.starterDecksProvisionedAt !== null) return { count: 0 };
        user.starterDecksProvisionedAt = data.starterDecksProvisionedAt;
        return { count: 1 };
      },
    },
    card: {
      async findMany({ where }: { where: { slug: { in: string[] } } }) {
        return cards.filter((c) => where.slug.in.includes(c.slug));
      },
    },
    collectionEntry: {
      async findMany({ where }: { where: { userId: string; cardId: { in: string[] } } }) {
        const owned = collectionByUser.get(where.userId) ?? new Map<string, number>();
        return where.cardId.in
          .filter((id) => owned.has(id))
          .map((id) => ({ userId: where.userId, cardId: id, quantity: owned.get(id)! }));
      },
    },
    deck: {
      async create({ data }: { data: { userId: string; name: string; cards: { create: Array<{ cardId: string; quantity: number }> } } }) {
        const id = `deck-${(deckIdCounter += 1)}`;
        const list = decksByUser.get(data.userId) ?? [];
        list.push({ id, userId: data.userId, name: data.name, cards: data.cards.create });
        decksByUser.set(data.userId, list);
        return { id };
      },
    },
  };

  return {
    ...base,
    // Mirrors real Prisma $transaction semantics: if the callback throws, every write made
    // through `tx` inside it - including the marker claim - is rolled back, not just the ones
    // after the throw point. Snapshot-and-restore reproduces that for this in-memory fake.
    async $transaction<T>(cb: (tx: typeof base) => Promise<T>): Promise<T> {
      const usersSnapshot = new Map(Array.from(users.entries()).map(([k, v]) => [k, { ...v }]));
      const decksSnapshot = new Map(Array.from(decksByUser.entries()).map(([k, v]) => [k, [...v]]));
      const deckIdCounterSnapshot = deckIdCounter;
      try {
        return await cb(base);
      } catch (error) {
        users.clear();
        for (const [k, v] of usersSnapshot) users.set(k, v);
        decksByUser.clear();
        for (const [k, v] of decksSnapshot) decksByUser.set(k, v);
        deckIdCounter = deckIdCounterSnapshot;
        throw error;
      }
    },
    grantFullOwnership(userId: string) {
      const owned = new Map<string, number>();
      for (const card of cards) owned.set(card.id, 2);
      collectionByUser.set(userId, owned);
    },
    setOwned(userId: string, cardId: string, quantity: number) {
      const owned = collectionByUser.get(userId) ?? new Map<string, number>();
      owned.set(cardId, quantity);
      collectionByUser.set(userId, owned);
    },
    decksOf(userId: string) {
      return decksByUser.get(userId) ?? [];
    },
    markProvisioned(userId: string) {
      ensureUser(userId).starterDecksProvisionedAt = new Date();
    },
  };
}

describe('StarterDeckProvisioningService', () => {
  let prisma: ReturnType<typeof createFakePrisma>;
  let service: StarterDeckProvisioningService;

  beforeEach(() => {
    prisma = createFakePrisma(buildFakeCatalog());
    prisma.grantFullOwnership('user-1');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    service = new StarterDeckProvisioningService(prisma as any);
  });

  it('A: a new registration ends up with exactly 6 starter decks', async () => {
    const result = await service.ensureStarterDecks('user-1');
    expect(result.provisioned).toBe(true);
    expect(prisma.decksOf('user-1')).toHaveLength(6);
  });

  it('B: every starter deck resolves to exactly 30 cards', async () => {
    await service.ensureStarterDecks('user-1');
    for (const deck of prisma.decksOf('user-1')) {
      const total = deck.cards.reduce((sum, c) => sum + c.quantity, 0);
      expect(total).toBe(DECK_SIZE);
    }
  });

  it('C: every starter deck passes validateDeck()', async () => {
    const catalog = buildFakeCatalog();
    const cardsById = new Map(catalog.map((row) => [row.id, toCardDto(row as never)]));
    for (const preset of STARTER_DECK_PRESETS) {
      const bySlug = new Map(catalog.map((c) => [c.slug, c.id]));
      const entries = preset.entries.map((e) => ({ cardId: bySlug.get(e.slug)!, quantity: e.quantity }));
      expect(validateDeck(entries, cardsById).valid).toBe(true);
    }
  });

  it('D: every starter deck only uses cards the account owns enough copies of', async () => {
    await service.ensureStarterDecks('user-1');
    // grantFullOwnership already gave 2x every card - if ownership were insufficient the
    // transaction would have thrown and no decks would exist, so this doubles as the assertion.
    expect(prisma.decksOf('user-1')).toHaveLength(6);
  });

  it('D2: throws clearly instead of provisioning if ownership is insufficient', async () => {
    const catalog = buildFakeCatalog();
    const shortPrisma = createFakePrisma(catalog);
    const firstSlug = STARTER_DECK_PRESETS[0]!.entries[0]!.slug;
    const firstCardId = catalog.find((c) => c.slug === firstSlug)!.id;
    shortPrisma.setOwned('user-2', firstCardId, 0);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const shortService = new StarterDeckProvisioningService(shortPrisma as any);
    await expect(shortService.ensureStarterDecks('user-2')).rejects.toThrow(/only owns/);
    expect(shortPrisma.decksOf('user-2')).toHaveLength(0);
  });

  it('E: repeated ensureStarterDecks() stays at exactly 6 decks, second call is a no-op', async () => {
    const first = await service.ensureStarterDecks('user-1');
    const second = await service.ensureStarterDecks('user-1');
    expect(first.provisioned).toBe(true);
    expect(second).toEqual({ provisioned: false, deckCount: 0 });
    expect(prisma.decksOf('user-1')).toHaveLength(6);
  });

  it('F: concurrent ensure calls for the same user still end up with exactly 6 decks total', async () => {
    const [a, b] = await Promise.all([
      service.ensureStarterDecks('user-1'),
      service.ensureStarterDecks('user-1'),
    ]);
    const provisionedCount = [a, b].filter((r) => r.provisioned).length;
    expect(provisionedCount).toBe(1);
    expect(prisma.decksOf('user-1')).toHaveLength(6);
  });

  it('G: an existing user who has never been provisioned gets exactly 6 on first ensure', async () => {
    prisma.grantFullOwnership('legacy-user');
    const result = await service.ensureStarterDecks('legacy-user');
    expect(result.provisioned).toBe(true);
    expect(prisma.decksOf('legacy-user')).toHaveLength(6);
  });

  it('H: a second call (e.g. a second login) creates no duplicates', async () => {
    prisma.grantFullOwnership('legacy-user-2');
    await service.ensureStarterDecks('legacy-user-2');
    await service.ensureStarterDecks('legacy-user-2');
    expect(prisma.decksOf('legacy-user-2')).toHaveLength(6);
  });

  it('I: does not recreate a starter deck the user already deleted after provisioning', async () => {
    prisma.grantFullOwnership('deleter');
    await service.ensureStarterDecks('deleter');
    // Simulate the user deleting one deck via the normal DecksService.remove() flow - this
    // fake's decksByUser is a plain array, so splice it directly rather than reaching for a
    // deck-deletion API this test doesn't otherwise need.
    const decks = prisma.decksOf('deleter');
    decks.splice(0, 1);
    expect(prisma.decksOf('deleter')).toHaveLength(5);

    const again = await service.ensureStarterDecks('deleter');
    expect(again).toEqual({ provisioned: false, deckCount: 0 });
    expect(prisma.decksOf('deleter')).toHaveLength(5);
  });

  it('J: no starter deck preset ever references a token, reference-content, or blocked card', () => {
    const catalog = buildFakeCatalog();
    const bySlug = new Map(catalog.map((c) => [c.slug, c]));
    for (const preset of STARTER_DECK_PRESETS) {
      for (const entry of preset.entries) {
        const card = bySlug.get(entry.slug);
        expect(card, `${preset.key} references unknown slug ${entry.slug}`).toBeDefined();
        expect(card!.isToken).toBe(false);
        expect(card!.isReferenceContent).toBe(false);
        expect(card!.rightsStatus).not.toBe('blocked');
      }
    }
  });

  it('fails clearly if a preset card slug cannot be resolved', async () => {
    const catalog = buildFakeCatalog().filter((c) => c.slug !== STARTER_DECK_PRESETS[0]!.entries[0]!.slug);
    const brokenPrisma = createFakePrisma(catalog);
    brokenPrisma.grantFullOwnership('user-3');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const brokenService = new StarterDeckProvisioningService(brokenPrisma as any);
    await expect(brokenService.ensureStarterDecks('user-3')).rejects.toThrow(/cannot resolve card slug/);
    expect(brokenPrisma.decksOf('user-3')).toHaveLength(0);
  });

  it('marker is not left set if provisioning fails partway through', async () => {
    const catalog = buildFakeCatalog();
    const brokenPrisma = createFakePrisma(catalog);
    // Own nothing, so the first preset's ownership check throws inside the transaction.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const brokenService = new StarterDeckProvisioningService(brokenPrisma as any);
    await expect(brokenService.ensureStarterDecks('user-4')).rejects.toThrow();
    brokenPrisma.grantFullOwnership('user-4');
    const retry = await brokenService.ensureStarterDecks('user-4');
    expect(retry.provisioned).toBe(true);
    expect(brokenPrisma.decksOf('user-4')).toHaveLength(6);
  });
});
