import { PrismaClient, type CardType, type Rarity } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

const RARITY_GRADIENT: Record<string, [string, string]> = {
  COMMON: ['#1c1c24', '#0b0b10'],
  RARE: ['#122a3f', '#0b0b10'],
  EPIC: ['#33123f', '#0b0b10'],
  LEGENDARY: ['#463414', '#0b0b10'],
  RAIDO: ['#460d17', '#0b0b10'],
};

function escapeXml(text: string): string {
  return text.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]!);
}

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/**
 * Dev/MVP placeholder art rendered as an inline SVG data URI so seeding never
 * depends on an external image host being reachable.
 */
function generatePlaceholderArt(name: string, rarity: string): string {
  const [from, to] = RARITY_GRADIENT[rarity] ?? RARITY_GRADIENT.COMMON!;
  const lines = wrapText(name, 14);
  const nameY = 430;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="640" viewBox="0 0 480 640">
<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs>
<rect width="480" height="640" fill="url(#g)"/>
<circle cx="240" cy="220" r="92" fill="none" stroke="#e3123e" stroke-width="3" opacity="0.55"/>
<text x="240" y="248" font-family="Georgia, serif" font-size="96" fill="#e3123e" text-anchor="middle" opacity="0.9">ᚱ</text>
${lines
  .map((line, i) => `<text x="240" y="${nameY + i * 34}" font-family="sans-serif" font-size="26" fill="#f5f5f7" text-anchor="middle">${escapeXml(line)}</text>`)
  .join('\n')}
<text x="240" y="600" font-family="sans-serif" font-size="16" letter-spacing="4" fill="#8a8a97" text-anchor="middle">KOD RAIDO</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

interface SeedCard {
  slug: string;
  name: string;
  type: CardType;
  rarity: Rarity;
  cost: number;
  tags: string[];
  attack?: number;
  health?: number;
  abilityText?: string;
  effectJson?: unknown[];
  linkedTrackSlug?: string;
}

const TRACKS = [
  {
    slug: 'awakening-of-shadow-release',
    title: 'Пробуждение Тени',
    coverUrl: generatePlaceholderArt('Пробуждение Тени', 'RARE'),
  },
  {
    slug: 'echo-of-resonance-release',
    title: 'Эхо Резонанса',
    coverUrl: generatePlaceholderArt('Эхо Резонанса', 'RARE'),
  },
  {
    slug: 'drakes-voice-release',
    title: 'Голос Дрейка',
    coverUrl: generatePlaceholderArt('Голос Дрейка', 'COMMON'),
  },
  {
    slug: 'code-raido-awakening-release',
    title: 'Код Райдо: Пробуждение',
    coverUrl: generatePlaceholderArt('Код Райдо: Пробуждение', 'RAIDO'),
  },
];

const CARDS: SeedCard[] = [
  // --- Characters: Shadow Aggro archetype (8) ---
  {
    slug: 'kael-rider-of-ash',
    name: 'Каэль, Всадник Пепла',
    type: 'CHARACTER',
    rarity: 'COMMON',
    cost: 1,
    tags: ['Shadow', 'Warrior'],
    attack: 2,
    health: 2,
  },
  {
    slug: 'vex-the-silent',
    name: 'Векс Безмолвный',
    type: 'CHARACTER',
    rarity: 'COMMON',
    cost: 2,
    tags: ['Shadow'],
    attack: 2,
    health: 3,
  },
  {
    slug: 'nyra-bloodrune',
    name: 'Найра Кровавая Руна',
    type: 'CHARACTER',
    rarity: 'RARE',
    cost: 3,
    tags: ['Shadow', 'Mystic'],
    attack: 3,
    health: 3,
    abilityText:
      'При выходе: если у вас есть другой Shadow-персонаж, получает +1 к атаке до конца хода.',
    effectJson: [
      {
        trigger: 'ON_PLAY',
        conditions: [{ type: 'HAS_TAG_ON_BOARD', value: 'Shadow' }],
        effects: [{ type: 'BUFF', target: 'SELF', attack: 1, health: 0, duration: 'END_OF_TURN' }],
      },
    ],
  },
  {
    slug: 'draven-nightblade',
    name: 'Дрейвен Ночной Клинок',
    type: 'CHARACTER',
    rarity: 'COMMON',
    cost: 3,
    tags: ['Shadow', 'Warrior'],
    attack: 4,
    health: 3,
  },
  {
    slug: 'selene-duskcaller',
    name: 'Селена Сумеречный Зов',
    type: 'CHARACTER',
    rarity: 'RARE',
    cost: 4,
    tags: ['Shadow', 'Exorcist'],
    attack: 4,
    health: 4,
  },
  {
    slug: 'morrigan-voice-of-ash',
    name: 'Морриган, Голос Пепла',
    type: 'CHARACTER',
    rarity: 'EPIC',
    cost: 5,
    tags: ['Shadow', 'Guardian'],
    attack: 5,
    health: 5,
  },
  {
    slug: 'raiden-umbra',
    name: 'Райден Умбра',
    type: 'CHARACTER',
    rarity: 'LEGENDARY',
    cost: 6,
    tags: ['Shadow', 'Warrior'],
    attack: 6,
    health: 6,
  },
  {
    slug: 'korrath-hollow-king',
    name: 'Коррат, Полый Король',
    type: 'CHARACTER',
    rarity: 'RAIDO',
    cost: 7,
    tags: ['Shadow', 'Guardian'],
    attack: 7,
    health: 6,
    abilityText: 'Когда вражеский персонаж погибает в ваш ход, первый раз за ход получает +1/+1.',
    effectJson: [
      {
        trigger: 'ON_DEATH',
        conditions: [],
        effects: [{ type: 'BUFF', target: 'SELF', attack: 1, health: 1, duration: 'PERMANENT' }],
      },
    ],
  },

  // --- Characters: Celestial / Resonance archetype (4) ---
  {
    slug: 'aria-lightweaver',
    name: 'Ария Ткущая Свет',
    type: 'CHARACTER',
    rarity: 'COMMON',
    cost: 2,
    tags: ['Celestial', 'Duo'],
    attack: 2,
    health: 3,
  },
  {
    slug: 'bram-stonewarden',
    name: 'Брам Каменный Страж',
    type: 'CHARACTER',
    rarity: 'COMMON',
    cost: 3,
    tags: ['Guardian'],
    attack: 3,
    health: 4,
  },
  {
    slug: 'wren-songkeeper',
    name: 'Рен Хранительница Песни',
    type: 'CHARACTER',
    rarity: 'RARE',
    cost: 4,
    tags: ['Celestial', 'Mystic'],
    attack: 3,
    health: 5,
  },
  {
    slug: 'halcyon-the-resonant',
    name: 'Хэлсион Резонирующая',
    type: 'CHARACTER',
    rarity: 'LEGENDARY',
    cost: 5,
    tags: ['Celestial'],
    attack: 4,
    health: 6,
    linkedTrackSlug: 'echo-of-resonance-release',
  },

  // --- Tracks (4) ---
  {
    slug: 'awakening-of-shadow',
    name: 'Пробуждение Тени',
    type: 'TRACK',
    rarity: 'RARE',
    cost: 2,
    tags: ['Shadow'],
    abilityText: 'Существа с тегом Shadow получают +2 к атаке до конца хода.',
    effectJson: [
      {
        trigger: 'ON_TRACK_PLAYED',
        conditions: [],
        effects: [
          { type: 'BUFF', target: 'FRIENDLY_ALL', attack: 2, health: 0, duration: 'END_OF_TURN' },
        ],
      },
    ],
    linkedTrackSlug: 'awakening-of-shadow-release',
  },
  {
    slug: 'echo-of-resonance',
    name: 'Эхо Резонанса',
    type: 'TRACK',
    rarity: 'RARE',
    cost: 3,
    tags: ['Celestial'],
    abilityText: 'Восстановите 3 здоровья Проводнику.',
    effectJson: [
      {
        trigger: 'ON_TRACK_PLAYED',
        conditions: [],
        effects: [{ type: 'HEAL', target: 'FRIENDLY_CONDUCTOR', amount: 3 }],
      },
    ],
    linkedTrackSlug: 'echo-of-resonance-release',
  },
  {
    slug: 'drakes-voice',
    name: 'Голос Дрейка',
    type: 'TRACK',
    rarity: 'COMMON',
    cost: 1,
    tags: [],
    abilityText: 'Доберите 1 карту.',
    effectJson: [
      { trigger: 'ON_TRACK_PLAYED', conditions: [], effects: [{ type: 'DRAW', amount: 1 }] },
    ],
    linkedTrackSlug: 'drakes-voice-release',
  },
  {
    slug: 'code-raido-awakening',
    name: 'Код Райдо: Пробуждение',
    type: 'TRACK',
    rarity: 'RAIDO',
    cost: 5,
    tags: [],
    abilityText:
      'Выберите: добрать 2 карты, восстановить 5 HP Проводнику, или дать двум союзникам +1/+1.',
    effectJson: [
      {
        trigger: 'ON_TRACK_PLAYED',
        conditions: [],
        effects: [{ type: 'DRAW', amount: 2 }],
      },
    ],
    linkedTrackSlug: 'code-raido-awakening-release',
  },

  // --- Events (4) ---
  {
    slug: 'surge-of-energy',
    name: 'Всплеск Энергии',
    type: 'EVENT',
    rarity: 'COMMON',
    cost: 2,
    tags: [],
    abilityText: 'Выбранный персонаж получает +1/+1 до конца хода.',
    effectJson: [
      {
        trigger: 'ON_PLAY',
        conditions: [],
        effects: [
          {
            type: 'BUFF',
            target: 'FRIENDLY_CHOSEN',
            attack: 1,
            health: 1,
            duration: 'END_OF_TURN',
          },
        ],
      },
    ],
  },
  {
    slug: 'shadow-breakthrough',
    name: 'Теневой Прорыв',
    type: 'EVENT',
    rarity: 'RARE',
    cost: 3,
    tags: ['Shadow'],
    abilityText: 'Нанесите 3 урона выбранному вражескому персонажу.',
    effectJson: [
      {
        trigger: 'ON_PLAY',
        conditions: [],
        effects: [{ type: 'DAMAGE', target: 'ENEMY_CHOSEN', amount: 3 }],
      },
    ],
  },
  {
    slug: 'resonance-recovery',
    name: 'Восстановление Резонанса',
    type: 'EVENT',
    rarity: 'COMMON',
    cost: 2,
    tags: [],
    abilityText: 'Восстановите 3 здоровья выбранному союзнику.',
    effectJson: [
      {
        trigger: 'ON_PLAY',
        conditions: [],
        effects: [{ type: 'HEAL', target: 'FRIENDLY_CHOSEN', amount: 3 }],
      },
    ],
  },
  {
    slug: 'seal-of-silence',
    name: 'Печать Тишины',
    type: 'EVENT',
    rarity: 'EPIC',
    cost: 3,
    tags: [],
    abilityText: 'Заглушите выбранного вражеского персонажа.',
    effectJson: [
      {
        trigger: 'ON_PLAY',
        conditions: [],
        effects: [{ type: 'SILENCE', target: 'ENEMY_CHOSEN' }],
      },
    ],
  },

  // --- Runes (4) ---
  {
    slug: 'rune-of-raido',
    name: 'Руна Райдо',
    type: 'RUNE',
    rarity: 'RAIDO',
    cost: 3,
    tags: [],
    abilityText: 'Первый разыгранный Персонаж каждый ход получает +1 к атаке до конца хода.',
    effectJson: [
      {
        trigger: 'ON_PLAY',
        conditions: [],
        effects: [
          {
            type: 'BUFF',
            target: 'FRIENDLY_CHOSEN',
            attack: 1,
            health: 0,
            duration: 'END_OF_TURN',
          },
        ],
      },
    ],
  },
  {
    slug: 'rune-of-echo',
    name: 'Руна Эха',
    type: 'RUNE',
    rarity: 'RARE',
    cost: 2,
    tags: [],
    abilityText: 'После применения карты Трека восстановить 1 HP.',
    effectJson: [
      {
        trigger: 'ON_TRACK_PLAYED',
        conditions: [],
        effects: [{ type: 'HEAL', target: 'FRIENDLY_CONDUCTOR', amount: 1 }],
      },
    ],
  },
  {
    slug: 'rune-of-shadow',
    name: 'Руна Тени',
    type: 'RUNE',
    rarity: 'RARE',
    cost: 2,
    tags: ['Shadow'],
    abilityText: 'Первое существо с тегом Shadow стоит на 1 Энергию меньше.',
    effectJson: [
      {
        trigger: 'TURN_START',
        conditions: [],
        effects: [{ type: 'COST_MODIFIER', target: 'FRIENDLY_ALL', amount: -1 }],
      },
    ],
  },
  {
    slug: 'rune-of-the-skybound',
    name: 'Руна Небосвода',
    type: 'RUNE',
    rarity: 'EPIC',
    cost: 4,
    tags: ['Celestial'],
    abilityText: 'Первый Celestial-персонаж каждый ход стоит на 1 меньше.',
    effectJson: [
      {
        trigger: 'TURN_START',
        conditions: [],
        effects: [{ type: 'COST_MODIFIER', target: 'FRIENDLY_ALL', amount: -1 }],
      },
    ],
  },
];

const DECK_PRESETS: Array<{ name: string; entries: Array<{ slug: string; quantity: number }> }> = [
  {
    name: 'Shadow Aggro',
    entries: [
      { slug: 'kael-rider-of-ash', quantity: 2 },
      { slug: 'vex-the-silent', quantity: 2 },
      { slug: 'nyra-bloodrune', quantity: 2 },
      { slug: 'draven-nightblade', quantity: 2 },
      { slug: 'selene-duskcaller', quantity: 2 },
      { slug: 'morrigan-voice-of-ash', quantity: 2 },
      { slug: 'raiden-umbra', quantity: 1 },
      { slug: 'korrath-hollow-king', quantity: 1 },
      { slug: 'awakening-of-shadow', quantity: 2 },
      { slug: 'drakes-voice', quantity: 2 },
      { slug: 'surge-of-energy', quantity: 2 },
      { slug: 'shadow-breakthrough', quantity: 2 },
      { slug: 'seal-of-silence', quantity: 2 },
      { slug: 'rune-of-raido', quantity: 1 },
      { slug: 'rune-of-shadow', quantity: 2 },
      { slug: 'rune-of-echo', quantity: 2 },
      { slug: 'aria-lightweaver', quantity: 1 },
    ],
  },
  {
    name: 'Resonance Midrange',
    entries: [
      { slug: 'bram-stonewarden', quantity: 2 },
      { slug: 'wren-songkeeper', quantity: 2 },
      { slug: 'halcyon-the-resonant', quantity: 1 },
      { slug: 'aria-lightweaver', quantity: 2 },
      { slug: 'echo-of-resonance', quantity: 2 },
      { slug: 'code-raido-awakening', quantity: 1 },
      { slug: 'resonance-recovery', quantity: 2 },
      { slug: 'seal-of-silence', quantity: 2 },
      { slug: 'rune-of-the-skybound', quantity: 2 },
      { slug: 'rune-of-echo', quantity: 2 },
      { slug: 'rune-of-raido', quantity: 1 },
      { slug: 'vex-the-silent', quantity: 2 },
      { slug: 'nyra-bloodrune', quantity: 2 },
      { slug: 'korrath-hollow-king', quantity: 1 },
      { slug: 'morrigan-voice-of-ash', quantity: 2 },
      { slug: 'selene-duskcaller', quantity: 2 },
      { slug: 'kael-rider-of-ash', quantity: 2 },
    ],
  },
];

for (const preset of DECK_PRESETS) {
  const total = preset.entries.reduce((sum, e) => sum + e.quantity, 0);
  if (total !== 30) {
    throw new Error(`Deck preset "${preset.name}" has ${total} cards; expected exactly 30.`);
  }
}

async function main() {
  console.log('[seed] Seeding tracks...');
  const trackIdBySlug = new Map<string, string>();
  for (const track of TRACKS) {
    const row = await prisma.track.upsert({
      where: { slug: track.slug },
      update: { title: track.title, coverUrl: track.coverUrl },
      create: { slug: track.slug, title: track.title, coverUrl: track.coverUrl },
    });
    trackIdBySlug.set(track.slug, row.id);
  }

  console.log('[seed] Seeding cards...');
  const cardIdBySlug = new Map<string, string>();
  for (const card of CARDS) {
    const linkedTrackIds = card.linkedTrackSlug ? [trackIdBySlug.get(card.linkedTrackSlug)!] : [];
    const row = await prisma.card.upsert({
      where: { slug: card.slug },
      update: {
        name: card.name,
        type: card.type,
        rarity: card.rarity,
        cost: card.cost,
        tags: card.tags,
        attack: card.attack,
        health: card.health,
        abilityText: card.abilityText,
        effectJson: (card.effectJson ?? []) as object[],
        linkedTrackIds,
        artworkUrl: generatePlaceholderArt(card.name, card.rarity),
        rightsStatus: 'placeholder',
        active: true,
        isPlayable: true,
      },
      create: {
        slug: card.slug,
        name: card.name,
        type: card.type,
        rarity: card.rarity,
        cost: card.cost,
        tags: card.tags,
        attack: card.attack,
        health: card.health,
        abilityText: card.abilityText,
        effectJson: (card.effectJson ?? []) as object[],
        linkedTrackIds,
        artworkUrl: generatePlaceholderArt(card.name, card.rarity),
        rightsStatus: 'placeholder',
        active: true,
        isPlayable: true,
      },
    });
    cardIdBySlug.set(card.slug, row.id);
  }

  console.log('[seed] Seeding demo user with starter collection and preset decks...');
  const demoEmail = 'demo@kodraido.io';
  const passwordHash = await argon2.hash('demo12345');
  const demoUser = await prisma.user.upsert({
    where: { email: demoEmail },
    update: {},
    create: { email: demoEmail, username: 'raido_demo', passwordHash },
  });

  await prisma.collectionEntry.createMany({
    data: CARDS.map((card) => ({
      userId: demoUser.id,
      cardId: cardIdBySlug.get(card.slug)!,
      quantity: 2,
    })),
    skipDuplicates: true,
  });

  for (const preset of DECK_PRESETS) {
    const existing = await prisma.deck.findFirst({
      where: { userId: demoUser.id, name: preset.name },
    });
    if (existing) continue;
    await prisma.deck.create({
      data: {
        userId: demoUser.id,
        name: preset.name,
        cards: {
          create: preset.entries.map((entry) => ({
            cardId: cardIdBySlug.get(entry.slug)!,
            quantity: entry.quantity,
          })),
        },
      },
    });
  }

  console.log(
    `[seed] Done. Seeded ${CARDS.length} cards, ${TRACKS.length} tracks, demo user ${demoEmail} / demo12345.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
