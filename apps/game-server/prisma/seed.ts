import { PrismaClient, type CardType, type Rarity, type RightsStatus } from '@prisma/client';
import * as argon2 from 'argon2';
import { STARTER_DECK_PRESETS } from '../src/content/starter-decks';

const prisma = new PrismaClient();

const RARITY_GRADIENT: Record<string, [string, string]> = {
  COMMON: ['#1c1c24', '#0b0b10'],
  RARE: ['#122a3f', '#0b0b10'],
  EPIC: ['#33123f', '#0b0b10'],
  LEGENDARY: ['#463414', '#0b0b10'],
  RAIDO: ['#460d17', '#0b0b10'],
};

function escapeXml(text: string): string {
  return text.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]!,
  );
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
  .map(
    (line, i) =>
      `<text x="240" y="${nameY + i * 34}" font-family="sans-serif" font-size="26" fill="#f5f5f7" text-anchor="middle">${escapeXml(line)}</text>`,
  )
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
  isToken?: boolean;
  isPlayable?: boolean;
  faction?: string;
  subFactions?: string[];
  archetypeTags?: string[];
  isNeutral?: boolean;
  isCrossoverEligible?: boolean;
  /** Canonical Card Roster 1.0: defaults to true. Legacy pre-Content-Pack-01 cards are seeded
   * with this false - archived out of the public catalog/starter collection/deck builder, but
   * never deleted (rows persist, old match logs and admin visibility are unaffected - see
   * docs/content-pack-01.md). */
  active?: boolean;
  /** Art Pack 01 production promotion (docs/art-bible-01.md): when set, overrides the default
   * generatePlaceholderArt() output for this card only. Every other card keeps regenerating its
   * placeholder on every seed run. */
  artworkUrl?: string;
  /** Paired with artworkUrl - defaults to 'placeholder' when unset. */
  rightsStatus?: RightsStatus;
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

const LEGACY_CARDS: SeedCard[] = [
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
    abilityText: 'Когда Коррат погибает, нанесите 3 урона Проводнику противника.',
    effectJson: [
      {
        trigger: 'ON_DEATH',
        conditions: [],
        effects: [{ type: 'DAMAGE', target: 'ENEMY_CONDUCTOR', amount: 3 }],
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
          {
            type: 'BUFF',
            target: 'FRIENDLY_ALL',
            tagFilter: 'Shadow',
            attack: 2,
            health: 0,
            duration: 'END_OF_TURN',
          },
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
    abilityText: 'Доберите 2 карты.',
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

  // --- Runes (3) ---
  // Canonical Card Roster 1.1: "Руна Райдо" (slug rune-of-raido) used to live here too, but it is
  // one of the 10 canonical Content Pack 01 neutral cards (see docs/content-pack-01.md) - moved to
  // NEUTRAL_CARDS below so the blanket "archive everything in LEGACY_CARDS" below doesn't
  // accidentally archive a canonical, starter-deck-used card.
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
        effects: [{ type: 'COST_MODIFIER', tagFilter: 'Shadow', amount: -1 }],
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
        effects: [{ type: 'COST_MODIFIER', tagFilter: 'Celestial', amount: -1 }],
      },
    ],
  },
];

// =====================================================================================
// CONTENT PACK 01 - 40 fully original cards (10 Neutral + 6 test factions x 5 cards).
// No third-party franchise IP: all names, lore, and abilities are original Kod Raido
// content, written purely to stress-test the DSL/archetype/deckbuilding/Resonance/
// Battlefield systems. No cardId-specific engine logic is used anywhere below - every
// ability routes through the generic effect DSL. See docs/content-pack-01.md.
// =====================================================================================

function withFaction(
  card: SeedCard,
  faction: string,
  subFactions: string[],
  archetypeTags: string[],
): SeedCard {
  return {
    ...card,
    faction,
    subFactions,
    archetypeTags,
    isNeutral: faction === 'NEUTRAL',
    isCrossoverEligible: faction === 'NEUTRAL',
  };
}

// --- Neutral (10) ---
const NEUTRAL_CARDS: SeedCard[] = [
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
        conditions: [{ type: 'ONCE_PER_TURN' }],
        effects: [
          {
            type: 'BUFF',
            target: 'TRIGGER_SOURCE',
            attack: 1,
            health: 0,
            duration: 'END_OF_TURN',
          },
        ],
      },
    ],
  },
  {
    slug: 'resonance-impulse',
    name: 'Импульс Резонанса',
    type: 'EVENT',
    rarity: 'COMMON',
    cost: 2,
    tags: [],
    abilityText:
      'Выбранный союзник получает Импульс (может атаковать в этот же ход). При Резонансе 3+: доберите 1 карту.',
    effectJson: [
      {
        trigger: 'ON_PLAY',
        conditions: [],
        effects: [{ type: 'ADD_STATUS', target: 'FRIENDLY_CHOSEN', status: 'IMPULSE' }],
      },
      {
        trigger: 'ON_PLAY',
        conditions: [{ type: 'RESONANCE_TIER_AT_LEAST', value: 3 }],
        effects: [{ type: 'DRAW', amount: 1 }],
      },
    ],
  },
  {
    slug: 'edits-echo',
    name: 'Эхо Эдита',
    type: 'CHARACTER',
    rarity: 'RARE',
    cost: 4,
    tags: [],
    attack: 3,
    health: 4,
    abilityText:
      'При выходе: повторите эффект последней разыгранной вами карты Трека с силой 50% (округление вниз). Не может повторить сама себя.',
    effectJson: [
      { trigger: 'ON_PLAY', conditions: [], effects: [{ type: 'REPEAT_LAST_TRACK', percent: 50 }] },
    ],
  },
  {
    slug: 'musical-burst',
    name: 'Музыкальный Всплеск',
    type: 'TRACK',
    rarity: 'COMMON',
    cost: 2,
    tags: [],
    abilityText: 'Доберите 1 карту. При Резонансе 3+: получите 1 доп. Энергию в этот ход.',
    effectJson: [
      { trigger: 'ON_TRACK_PLAYED', conditions: [], effects: [{ type: 'DRAW', amount: 1 }] },
      {
        trigger: 'ON_TRACK_PLAYED',
        conditions: [{ type: 'RESONANCE_TIER_AT_LEAST', value: 3 }],
        effects: [{ type: 'GAIN_ENERGY', amount: 1 }],
      },
    ],
  },
  {
    slug: 'supporters-pulse',
    name: 'Пульс Поддержки',
    type: 'EVENT',
    rarity: 'RARE',
    cost: 2,
    tags: [],
    abilityText:
      'Выберите: восстановите 3 здоровья союзнику ИЛИ нанесите 2 урона врагу - в зависимости от выбранной цели.',
    effectJson: [
      {
        trigger: 'ON_PLAY',
        conditions: [],
        effects: [
          {
            type: 'CHOOSE_ONE',
            ifFriendlyTarget: [{ type: 'HEAL', target: 'FRIENDLY_CHOSEN', amount: 3 }],
            ifEnemyTarget: [{ type: 'DAMAGE', target: 'ENEMY_CHOSEN', amount: 2 }],
          },
        ],
      },
    ],
  },
  {
    slug: 'wave-of-comments',
    name: 'Волна Комментариев',
    type: 'TRACK',
    rarity: 'RARE',
    cost: 3,
    tags: [],
    abilityText:
      'Доберите 1 карту. При Резонансе 3+: все ваши существа получают +1/+1 до конца хода.',
    effectJson: [
      { trigger: 'ON_TRACK_PLAYED', conditions: [], effects: [{ type: 'DRAW', amount: 1 }] },
      {
        trigger: 'ON_TRACK_PLAYED',
        conditions: [{ type: 'RESONANCE_TIER_AT_LEAST', value: 3 }],
        effects: [
          { type: 'BUFF', target: 'FRIENDLY_ALL', attack: 1, health: 1, duration: 'END_OF_TURN' },
        ],
      },
    ],
  },
  {
    slug: 'presave-signal',
    name: 'Пресейв-Сигнал',
    type: 'EVENT',
    rarity: 'COMMON',
    cost: 1,
    tags: [],
    abilityText: 'Получите 1 доп. Энергию в этот ход. При Резонансе 5+: доберите 1 карту.',
    effectJson: [
      { trigger: 'ON_PLAY', conditions: [], effects: [{ type: 'GAIN_ENERGY', amount: 1 }] },
      {
        trigger: 'ON_PLAY',
        conditions: [{ type: 'RESONANCE_TIER_AT_LEAST', value: 5 }],
        effects: [{ type: 'DRAW', amount: 1 }],
      },
    ],
  },
  {
    slug: 'scene-transition',
    name: 'Переход Сцены',
    type: 'EVENT',
    rarity: 'COMMON',
    cost: 2,
    tags: [],
    abilityText: 'Переместите верхнюю карту вашей колоды в низ, затем доберите карту.',
    effectJson: [
      {
        trigger: 'ON_PLAY',
        conditions: [],
        effects: [
          { type: 'REORDER_TOP', amount: 1, destination: 'BOTTOM' },
          { type: 'DRAW', amount: 1 },
        ],
      },
    ],
  },
  {
    slug: 'voice-of-subscribers',
    name: 'Голос Подписчиков',
    type: 'RUNE',
    rarity: 'EPIC',
    cost: 3,
    tags: [],
    abilityText:
      'Пока Резонанс этой карты 3+: первый разыгранный вами Персонаж каждый ход получает +1/+1 до конца хода.',
    effectJson: [
      {
        trigger: 'ON_PLAY',
        conditions: [{ type: 'ONCE_PER_TURN' }, { type: 'RESONANCE_TIER_AT_LEAST', value: 3 }],
        effects: [
          { type: 'BUFF', target: 'TRIGGER_SOURCE', attack: 1, health: 1, duration: 'END_OF_TURN' },
        ],
      },
    ],
  },
  {
    slug: 'code-raido-resonance',
    name: 'Код Райдо: Резонанс',
    type: 'TRACK',
    rarity: 'RAIDO',
    cost: 5,
    tags: [],
    abilityText: 'Доберите 2 карты. При Резонансе 5+: все ваши существа получают Щит.',
    effectJson: [
      { trigger: 'ON_TRACK_PLAYED', conditions: [], effects: [{ type: 'DRAW', amount: 2 }] },
      {
        trigger: 'ON_TRACK_PLAYED',
        conditions: [{ type: 'RESONANCE_TIER_AT_LEAST', value: 5 }],
        effects: [{ type: 'SHIELD', target: 'FRIENDLY_ALL' }],
      },
    ],
  },
].map((c) => withFaction(c, 'NEUTRAL', [], []));

// --- Shadow: "Орден Сумеречного Эха" - summon tokens, death triggers, revive, snowball ---
const SHADOW_TOKEN: SeedCard = withFaction(
  {
    slug: 'shadow-echo-token',
    name: 'Эхо-Тень',
    type: 'CHARACTER',
    rarity: 'COMMON',
    cost: 1,
    tags: ['Shadow', 'Token'],
    attack: 1,
    health: 1,
    isToken: true,
    isPlayable: false,
  },
  'SHADOW',
  ['Орден Сумеречного Эха'],
  ['Token'],
);

const SHADOW_CARDS: SeedCard[] = [
  {
    slug: 'whisper-of-the-forgotten',
    name: 'Шёпот Заброшенных',
    type: 'CHARACTER',
    rarity: 'COMMON',
    cost: 1,
    tags: ['Shadow'],
    attack: 1,
    health: 2,
    // Art Pack 02 Card 01 - owner-approved production artwork.
    artworkUrl: '/art/cards/whisper-of-the-forgotten.webp',
    rightsStatus: 'owned',
    abilityText: 'При гибели призовите Эхо-Тень 1/1. При Резонансе 3+: призовите ещё одну.',
    effectJson: [
      {
        trigger: 'ON_DEATH',
        conditions: [],
        effects: [{ type: 'SUMMON', summonCardSlug: 'shadow-echo-token', amount: 1 }],
      },
      {
        trigger: 'ON_DEATH',
        conditions: [{ type: 'RESONANCE_TIER_AT_LEAST', value: 3 }],
        effects: [{ type: 'SUMMON', summonCardSlug: 'shadow-echo-token', amount: 1 }],
      },
    ],
  },
  {
    slug: 'ashen-blade',
    name: 'Клинок Пепла',
    type: 'CHARACTER',
    rarity: 'COMMON',
    cost: 2,
    tags: ['Shadow'],
    attack: 3,
    health: 1,
    // Art Pack 02 Card 02 - owner-approved production artwork.
    artworkUrl: '/art/cards/ashen-blade.webp',
    rightsStatus: 'owned',
  },
  {
    slug: 'keeper-of-smoldering-embers',
    name: 'Хранитель Тлеющих Углей',
    type: 'CHARACTER',
    rarity: 'RARE',
    cost: 3,
    tags: ['Shadow'],
    attack: 2,
    health: 3,
    abilityText: 'При выходе: призовите Эхо-Тень 1/1.',
    effectJson: [
      {
        trigger: 'ON_PLAY',
        conditions: [],
        effects: [{ type: 'SUMMON', summonCardSlug: 'shadow-echo-token', amount: 1 }],
      },
    ],
  },
  {
    slug: 'rune-of-the-echoing-dusk',
    name: 'Рунный Страж Эха',
    type: 'RUNE',
    rarity: 'EPIC',
    cost: 3,
    tags: ['Shadow'],
    abilityText:
      'Когда любое ваше существо погибает, призовите на его место Эхо-Тень 1/1.',
    effectJson: [
      {
        trigger: 'ON_DEATH',
        conditions: [],
        effects: [{ type: 'SUMMON', summonCardSlug: 'shadow-echo-token', amount: 1 }],
      },
    ],
  },
  {
    slug: 'necromancer-of-the-twilight-order',
    name: 'Некромант Сумеречного Ордена',
    type: 'CHARACTER',
    rarity: 'LEGENDARY',
    cost: 5,
    tags: ['Shadow'],
    attack: 4,
    health: 5,
    abilityText:
      'При выходе: верните на поле первого подходящего Shadow-персонажа из вашего сброса (100% характеристик).',
    // Art Pack 01 Production Candidate 01b - FINAL APPROVED (docs/art-bible-01.md). The only
    // card in Content Pack 01 with real commissioned art as of this change; all others keep
    // generatePlaceholderArt().
    artworkUrl: '/art/cards/necromancer-of-the-twilight-order.webp',
    rightsStatus: 'owned',
    effectJson: [
      {
        trigger: 'ON_PLAY',
        conditions: [],
        effects: [{ type: 'REVIVE_FROM_DISCARD', amount: 1, tagFilter: 'Shadow', percent: 100 }],
      },
    ],
  },
].map((c) => withFaction(c, 'SHADOW', ['Орден Сумеречного Эха'], ['Summon', 'DeathTrigger', 'Snowball']));

// --- Purification: "Стражи Белой Руны" - cleanse, curses, shields, control ---
const PURIFICATION_CARDS: SeedCard[] = [
  {
    slug: 'acolyte-of-the-white-rune',
    name: 'Послушник Белой Руны',
    type: 'CHARACTER',
    rarity: 'COMMON',
    cost: 1,
    tags: ['Purification'],
    attack: 1,
    health: 3,
    abilityText: 'При выходе: снимите Проклятие и Заглушение с выбранного союзника.',
    effectJson: [
      { trigger: 'ON_PLAY', conditions: [], effects: [{ type: 'CLEANSE', target: 'FRIENDLY_CHOSEN' }] },
    ],
  },
  {
    slug: 'seal-of-the-curse',
    name: 'Печать Проклятия',
    type: 'EVENT',
    rarity: 'RARE',
    cost: 2,
    tags: ['Purification'],
    abilityText:
      'Наложите Проклятие на выбранного вражеского персонажа - он не может атаковать, пока Проклятие не снято.',
    effectJson: [
      {
        trigger: 'ON_PLAY',
        conditions: [],
        effects: [{ type: 'ADD_STATUS', target: 'ENEMY_CHOSEN', status: 'CURSE' }],
      },
    ],
  },
  {
    slug: 'warden-of-the-barrier',
    name: 'Хранительница Барьера',
    type: 'CHARACTER',
    rarity: 'RARE',
    cost: 3,
    tags: ['Purification'],
    attack: 2,
    health: 5,
    abilityText:
      'При выходе: получает Щит. При Резонансе 5+: снимите Проклятие и Заглушение со всех союзников.',
    effectJson: [
      { trigger: 'ON_PLAY', conditions: [], effects: [{ type: 'SHIELD', target: 'SELF' }] },
      {
        trigger: 'ON_PLAY',
        conditions: [{ type: 'RESONANCE_TIER_AT_LEAST', value: 5 }],
        effects: [{ type: 'CLEANSE', target: 'FRIENDLY_ALL' }],
      },
    ],
  },
  {
    slug: 'rune-of-curse-breaking',
    name: 'Руна Разрушения Проклятий',
    type: 'RUNE',
    rarity: 'EPIC',
    cost: 3,
    tags: ['Purification'],
    abilityText: 'В начале каждого вашего хода снимите Проклятие и Заглушение со всех союзников.',
    effectJson: [
      { trigger: 'TURN_START', conditions: [], effects: [{ type: 'CLEANSE', target: 'FRIENDLY_ALL' }] },
    ],
  },
  {
    slug: 'high-warden-of-the-white-rune',
    name: 'Верховная Хранительница Руны',
    type: 'CHARACTER',
    rarity: 'LEGENDARY',
    cost: 6,
    tags: ['Purification'],
    attack: 5,
    health: 7,
    abilityText:
      'Выберите: очистите и защитите союзника Щитом ИЛИ проклиньте врага - в зависимости от выбранной цели.',
    // Art Pack 01 Production Candidate 02b - FINAL APPROVED (docs/art-bible-01.md). Spear-tip
    // apex clipping in the shipped crops is an accepted minor loss - see the review report.
    artworkUrl: '/art/cards/high-warden-of-the-white-rune.webp',
    rightsStatus: 'owned',
    effectJson: [
      {
        trigger: 'ON_PLAY',
        conditions: [],
        effects: [
          {
            type: 'CHOOSE_ONE',
            ifFriendlyTarget: [
              { type: 'CLEANSE', target: 'FRIENDLY_CHOSEN' },
              { type: 'SHIELD', target: 'FRIENDLY_CHOSEN' },
            ],
            ifEnemyTarget: [{ type: 'ADD_STATUS', target: 'ENEMY_CHOSEN', status: 'CURSE' }],
          },
        ],
      },
    ],
  },
].map((c) =>
  withFaction(c, 'PURIFICATION', ['Стражи Белой Руны'], ['Cleanse', 'Curse', 'Shield', 'Control']),
);

// --- Bond: "Дом Весеннего Света" - healing, protection, sustain ---
const BOND_CARDS: SeedCard[] = [
  {
    slug: 'child-of-the-spring-light',
    name: 'Дитя Весеннего Света',
    type: 'CHARACTER',
    rarity: 'COMMON',
    cost: 1,
    tags: ['Bond'],
    attack: 1,
    health: 3,
    abilityText: 'При выходе: восстановите 1 здоровье Проводнику.',
    effectJson: [
      {
        trigger: 'ON_PLAY',
        conditions: [],
        effects: [{ type: 'HEAL', target: 'FRIENDLY_CONDUCTOR', amount: 1 }],
      },
    ],
  },
  {
    slug: 'keeper-of-the-promise',
    name: 'Хранитель Обещания',
    type: 'CHARACTER',
    rarity: 'RARE',
    cost: 3,
    tags: ['Bond'],
    attack: 2,
    health: 5,
    abilityText: 'При выходе: восстановите 3 здоровья выбранному союзнику.',
    effectJson: [
      { trigger: 'ON_PLAY', conditions: [], effects: [{ type: 'HEAL', target: 'FRIENDLY_CHOSEN', amount: 3 }] },
    ],
  },
  {
    slug: 'light-of-the-hearth',
    name: 'Свет Очага',
    type: 'TRACK',
    rarity: 'RARE',
    cost: 2,
    tags: ['Bond'],
    abilityText:
      'Восстановите 3 здоровья Проводнику. При Резонансе 3+: восстановите 2 здоровья всем союзным существам.',
    effectJson: [
      {
        trigger: 'ON_TRACK_PLAYED',
        conditions: [],
        effects: [{ type: 'HEAL', target: 'FRIENDLY_CONDUCTOR', amount: 3 }],
      },
      {
        trigger: 'ON_TRACK_PLAYED',
        conditions: [{ type: 'RESONANCE_TIER_AT_LEAST', value: 3 }],
        effects: [{ type: 'HEAL', target: 'FRIENDLY_ALL', amount: 2 }],
      },
    ],
  },
  {
    slug: 'rune-of-reflected-light',
    name: 'Руна Отражённого Света',
    type: 'RUNE',
    rarity: 'EPIC',
    cost: 3,
    tags: ['Bond'],
    abilityText: 'Первый раз за матч, когда союзник исцеляется, он получает Щит.',
    effectJson: [
      {
        trigger: 'ON_HEAL',
        conditions: [{ type: 'ONCE_PER_MATCH' }],
        effects: [{ type: 'SHIELD', target: 'TRIGGER_SOURCE' }],
      },
    ],
  },
  {
    slug: 'matriarch-of-the-spring-light',
    name: 'Матриарх Дома Весеннего Света',
    type: 'CHARACTER',
    rarity: 'LEGENDARY',
    cost: 5,
    tags: ['Bond'],
    attack: 4,
    health: 7,
    // Art Pack 01 Production Candidate 03 - FINAL APPROVED (docs/art-bible-01.md).
    artworkUrl: '/art/cards/matriarch-of-the-spring-light.webp',
    rightsStatus: 'owned',
    abilityText:
      'При выходе: восстановите 2 здоровья всем союзникам. При Резонансе 5+: все союзники получают Щит.',
    effectJson: [
      { trigger: 'ON_PLAY', conditions: [], effects: [{ type: 'HEAL', target: 'FRIENDLY_ALL', amount: 2 }] },
      {
        trigger: 'ON_PLAY',
        conditions: [{ type: 'RESONANCE_TIER_AT_LEAST', value: 5 }],
        effects: [{ type: 'SHIELD', target: 'FRIENDLY_ALL' }],
      },
    ],
  },
].map((c) => withFaction(c, 'BOND', ['Дом Весеннего Света'], ['Heal', 'Sustain', 'Shield']));

// --- Veil: "Двор Безымянной Тени" - Hidden, sequencing, ambush, cost manipulation ---
const VEIL_CARDS: SeedCard[] = [
  {
    slug: 'blade-from-the-shadow',
    name: 'Клинок из Тени',
    type: 'CHARACTER',
    rarity: 'COMMON',
    cost: 2,
    tags: ['Veil'],
    attack: 3,
    health: 2,
    abilityText: 'При выходе: становится Скрытым (не может быть выбран целью, пока не атакует).',
    effectJson: [
      { trigger: 'ON_PLAY', conditions: [], effects: [{ type: 'ADD_STATUS', target: 'SELF', status: 'HIDDEN' }] },
    ],
  },
  {
    slug: 'scouting-of-the-court',
    name: 'Разведка Двора',
    type: 'EVENT',
    rarity: 'COMMON',
    cost: 1,
    tags: ['Veil'],
    abilityText: 'Следующая карта Veil, разыгранная в этот ход, стоит на 1 Энергию меньше.',
    effectJson: [
      {
        trigger: 'ON_PLAY',
        conditions: [],
        effects: [{ type: 'COST_MODIFIER', tagFilter: 'Veil', amount: -1 }],
      },
    ],
  },
  {
    slug: 'master-of-the-ambush',
    name: 'Мастер Засады',
    type: 'CHARACTER',
    rarity: 'RARE',
    cost: 3,
    tags: ['Veil'],
    attack: 3,
    health: 3,
    abilityText: 'При выходе: становится Скрытым и получает Импульс (может атаковать в этот же ход).',
    effectJson: [
      {
        trigger: 'ON_PLAY',
        conditions: [],
        effects: [
          { type: 'ADD_STATUS', target: 'SELF', status: 'HIDDEN' },
          { type: 'ADD_STATUS', target: 'SELF', status: 'IMPULSE' },
        ],
      },
    ],
  },
  {
    slug: 'rune-of-the-nameless-court',
    name: 'Руна Безымянного Двора',
    type: 'RUNE',
    rarity: 'EPIC',
    cost: 3,
    tags: ['Veil'],
    abilityText: 'В начале каждого вашего хода первая карта Veil стоит на 1 Энергию меньше.',
    effectJson: [
      {
        trigger: 'TURN_START',
        conditions: [],
        effects: [{ type: 'COST_MODIFIER', tagFilter: 'Veil', amount: -1 }],
      },
    ],
  },
  {
    slug: 'lord-of-the-nameless-shadow',
    name: 'Владыка Безымянной Тени',
    type: 'CHARACTER',
    rarity: 'LEGENDARY',
    cost: 5,
    tags: ['Veil'],
    attack: 5,
    health: 4,
    // Art Pack 01 Production Candidate 04 - FINAL APPROVED (docs/art-bible-01.md).
    artworkUrl: '/art/cards/lord-of-the-nameless-shadow.webp',
    rightsStatus: 'owned',
    abilityText:
      'Выберите: укройте союзника в Тени (Скрытый) ИЛИ заглушите врага - в зависимости от выбранной цели.',
    effectJson: [
      {
        trigger: 'ON_PLAY',
        conditions: [],
        effects: [
          {
            type: 'CHOOSE_ONE',
            ifFriendlyTarget: [{ type: 'ADD_STATUS', target: 'FRIENDLY_CHOSEN', status: 'HIDDEN' }],
            ifEnemyTarget: [{ type: 'SILENCE', target: 'ENEMY_CHOSEN' }],
          },
        ],
      },
    ],
  },
].map((c) => withFaction(c, 'VEIL', ['Двор Безымянной Тени'], ['Hidden', 'Tempo', 'CostReduction']));

// --- Mystery: "Архив Серого Тумана" - deck inspect/reorder, prediction, combo control ---
const MYSTERY_CARDS: SeedCard[] = [
  {
    slug: 'archivist-of-the-grey-mist',
    name: 'Архивариус Серого Тумана',
    type: 'CHARACTER',
    rarity: 'COMMON',
    cost: 2,
    tags: ['Mystery'],
    attack: 2,
    health: 2,
    abilityText: 'При выходе: просмотрите верхние 3 карты колоды и поднимите наверх первую карту Mystery.',
    effectJson: [
      {
        trigger: 'ON_PLAY',
        conditions: [],
        effects: [{ type: 'REORDER_TOP', amount: 3, tagFilter: 'Mystery' }],
      },
    ],
  },
  {
    slug: 'fortune-teller-of-the-mist',
    name: 'Предсказательница Тумана',
    type: 'CHARACTER',
    rarity: 'RARE',
    cost: 3,
    tags: ['Mystery'],
    attack: 2,
    health: 4,
    abilityText: 'При выходе: доберите карту, затем переместите верхнюю карту колоды в низ.',
    effectJson: [
      {
        trigger: 'ON_PLAY',
        conditions: [],
        effects: [
          { type: 'DRAW', amount: 1 },
          { type: 'REORDER_TOP', amount: 2, destination: 'BOTTOM' },
        ],
      },
    ],
  },
  {
    slug: 'scroll-of-the-grey-archive',
    name: 'Свиток Серого Архива',
    type: 'EVENT',
    rarity: 'RARE',
    cost: 2,
    tags: ['Mystery'],
    abilityText: 'Просмотрите верхние 4 карты колоды и поднимите наверх первую карту Mystery.',
    effectJson: [
      {
        trigger: 'ON_PLAY',
        conditions: [],
        effects: [{ type: 'REORDER_TOP', amount: 4, tagFilter: 'Mystery' }],
      },
    ],
  },
  {
    slug: 'rune-of-foresight',
    name: 'Руна Предвидения',
    type: 'RUNE',
    rarity: 'EPIC',
    cost: 3,
    tags: ['Mystery'],
    abilityText:
      'В начале каждого вашего хода просмотрите верхние 2 карты колоды и поднимите наверх первую карту Mystery.',
    effectJson: [
      {
        trigger: 'TURN_START',
        conditions: [],
        effects: [{ type: 'REORDER_TOP', amount: 2, tagFilter: 'Mystery' }],
      },
    ],
  },
  {
    slug: 'keeper-of-the-grey-mist',
    name: 'Хранитель Серого Тумана',
    type: 'CHARACTER',
    rarity: 'LEGENDARY',
    cost: 6,
    tags: ['Mystery'],
    attack: 5,
    health: 6,
    // Art Pack 01 Production Candidate 05 - FINAL APPROVED (docs/art-bible-01.md).
    artworkUrl: '/art/cards/keeper-of-the-grey-mist.webp',
    rightsStatus: 'owned',
    abilityText:
      'При выходе: доберите 2 карты. При Резонансе 3+: поднимите наверх первую карту Mystery среди верхних 3.',
    effectJson: [
      { trigger: 'ON_PLAY', conditions: [], effects: [{ type: 'DRAW', amount: 2 }] },
      {
        trigger: 'ON_PLAY',
        conditions: [{ type: 'RESONANCE_TIER_AT_LEAST', value: 3 }],
        effects: [{ type: 'REORDER_TOP', amount: 3, tagFilter: 'Mystery' }],
      },
    ],
  },
].map((c) =>
  withFaction(c, 'MYSTERY', ['Архив Серого Тумана'], ['DeckManipulation', 'Prediction', 'ComboControl']),
);

// --- Cosmic: "Наследники Звёздного Потока" - temporary Energy, scaling, late-game ---
const COSMIC_CARDS: SeedCard[] = [
  {
    slug: 'spark-of-the-stellar-stream',
    name: 'Искра Звёздного Потока',
    type: 'CHARACTER',
    rarity: 'COMMON',
    cost: 1,
    tags: ['Cosmic'],
    attack: 1,
    health: 1,
    abilityText: 'При выходе: получите 1 доп. Энергию в этот ход.',
    effectJson: [
      { trigger: 'ON_PLAY', conditions: [], effects: [{ type: 'GAIN_ENERGY', amount: 1 }] },
    ],
  },
  {
    slug: 'disciple-of-the-stellar-heirs',
    name: 'Ученица Звёздных Наследников',
    type: 'CHARACTER',
    rarity: 'RARE',
    cost: 2,
    tags: ['Cosmic'],
    attack: 1,
    health: 3,
    abilityText: 'При выходе: следующая карта Cosmic в этот ход стоит на 2 Энергии меньше.',
    effectJson: [
      {
        trigger: 'ON_PLAY',
        conditions: [],
        effects: [{ type: 'COST_MODIFIER', tagFilter: 'Cosmic', amount: -2 }],
      },
    ],
  },
  {
    slug: 'portal-of-the-stellar-stream',
    name: 'Портал Звёздного Потока',
    type: 'TRACK',
    rarity: 'RARE',
    cost: 3,
    tags: ['Cosmic'],
    abilityText: 'Получите 2 доп. Энергии в этот ход.',
    effectJson: [
      { trigger: 'ON_TRACK_PLAYED', conditions: [], effects: [{ type: 'GAIN_ENERGY', amount: 2 }] },
    ],
  },
  {
    slug: 'rune-of-the-stellar-tide',
    name: 'Руна Звёздного Прилива',
    type: 'RUNE',
    rarity: 'EPIC',
    cost: 4,
    tags: ['Cosmic'],
    abilityText: 'В начале каждого вашего хода получите 1 доп. Энергию.',
    effectJson: [
      { trigger: 'TURN_START', conditions: [], effects: [{ type: 'GAIN_ENERGY', amount: 1 }] },
    ],
  },
  {
    slug: 'lord-of-the-stellar-stream',
    name: 'Владыка Звёздного Потока',
    type: 'CHARACTER',
    rarity: 'LEGENDARY',
    cost: 8,
    tags: ['Cosmic'],
    attack: 7,
    health: 8,
    // Art Pack 01 Production Candidate 06 - FINAL APPROVED (docs/art-bible-01.md).
    artworkUrl: '/art/cards/lord-of-the-stellar-stream.webp',
    rightsStatus: 'owned',
    abilityText: 'При выходе: доберите карту. При Резонансе 5+: получает +2/+2 навсегда.',
    effectJson: [
      { trigger: 'ON_PLAY', conditions: [], effects: [{ type: 'DRAW', amount: 1 }] },
      {
        trigger: 'ON_PLAY',
        conditions: [{ type: 'RESONANCE_TIER_AT_LEAST', value: 5 }],
        effects: [{ type: 'BUFF', target: 'SELF', attack: 2, health: 2, duration: 'PERMANENT' }],
      },
    ],
  },
].map((c) => withFaction(c, 'COSMIC', ['Наследники Звёздного Потока'], ['Ramp', 'Scaling', 'CostReduction']));

const CONTENT_PACK_01_CARDS: SeedCard[] = [
  ...NEUTRAL_CARDS,
  SHADOW_TOKEN,
  ...SHADOW_CARDS,
  ...PURIFICATION_CARDS,
  ...BOND_CARDS,
  ...VEIL_CARDS,
  ...MYSTERY_CARDS,
  ...COSMIC_CARDS,
];

// Canonical Card Roster 1.0: Content Pack 01's 40 cards (+1 token) are the only active launch
// pool. The 23 pre-Content-Pack-01 legacy cards are archived (active: false) rather than
// deleted - see docs/content-pack-01.md's "Canonical launch set" section for the full rationale
// and per-card KEEP/REWORK/ARCHIVE disposition.
const CARDS: SeedCard[] = [
  ...LEGACY_CARDS.map((c) => ({ ...withFaction(c, 'NEUTRAL', [], []), active: false })),
  ...CONTENT_PACK_01_CARDS,
];

// Canonical Card Roster 1.0: the pre-Content-Pack-01 "Shadow Aggro (MVP Demo)" / "Resonance
// Midrange (MVP Demo)" decks that used to be seeded here for the demo account were built
// entirely from legacy (now-archived) cards. Removed rather than kept unused - the demo account
// now gets exactly the same 6 canonical starter decks a real fresh registration receives, see
// docs/content-pack-01.md. The legacy cards themselves are untouched in LEGACY_CARDS above
// (rows preserved, just active: false).

// The 6 Content Pack 01 starter deck presets (Shadow Aggro, Bond Sustain, Mystery Control,
// Cosmic Ramp, Veil Tempo, Purification Control) live in src/content/starter-decks.ts - the same
// module StarterDeckProvisioningService uses for real user provisioning, so seed data and
// real-account decks can never drift apart. See that file for the definitions.
const DECK_PRESETS: Array<{ name: string; entries: Array<{ slug: string; quantity: number }> }> =
  STARTER_DECK_PRESETS.map((preset) => ({ name: preset.name, entries: preset.entries }));

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
        artworkUrl: card.artworkUrl ?? generatePlaceholderArt(card.name, card.rarity),
        rightsStatus: card.rightsStatus ?? 'placeholder',
        active: card.active ?? true,
        isPlayable: card.isPlayable ?? true,
        isToken: card.isToken ?? false,
        faction: card.faction ?? 'NEUTRAL',
        subFactions: card.subFactions ?? [],
        archetypeTags: card.archetypeTags ?? [],
        isNeutral: card.isNeutral ?? true,
        isCrossoverEligible: card.isCrossoverEligible ?? true,
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
        artworkUrl: card.artworkUrl ?? generatePlaceholderArt(card.name, card.rarity),
        rightsStatus: card.rightsStatus ?? 'placeholder',
        active: card.active ?? true,
        isPlayable: card.isPlayable ?? true,
        isToken: card.isToken ?? false,
        faction: card.faction ?? 'NEUTRAL',
        subFactions: card.subFactions ?? [],
        archetypeTags: card.archetypeTags ?? [],
        isNeutral: card.isNeutral ?? true,
        isCrossoverEligible: card.isCrossoverEligible ?? true,
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
    data: CARDS.filter((card) => !card.isToken && card.active !== false).map((card) => ({
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
    `[seed] Done. Seeded ${CARDS.length} cards (${CARDS.filter((c) => c.active !== false).length} active, ` +
      `${CARDS.filter((c) => c.active === false).length} archived legacy), ${TRACKS.length} tracks, ` +
      `demo user ${demoEmail} / demo12345.`,
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
