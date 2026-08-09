import type {
  Card,
  CharacterCard,
  EffectDefinition,
  EventCard,
  Rarity,
  RuneCard,
  TrackCard,
} from '@kod-raido/shared';
import { STARTING_CONDUCTOR_HP } from '@kod-raido/shared';
import type { MatchContext, MatchState, PlayerMatchState, UnitInstance } from './match/types.js';

let counter = 0;
function nextId(prefix: string): string {
  counter += 1;
  return `${prefix}-${counter}`;
}

interface CharacterOverrides {
  id?: string;
  slug?: string;
  name?: string;
  rarity?: Rarity;
  cost?: number;
  tags?: string[];
  attack?: number;
  health?: number;
  effects?: EffectDefinition[];
}

export function makeCharacter(overrides: CharacterOverrides = {}): CharacterCard {
  const id = overrides.id ?? nextId('char');
  return {
    id,
    slug: overrides.slug ?? id,
    name: overrides.name ?? id,
    type: 'CHARACTER',
    rarity: overrides.rarity ?? 'COMMON',
    cost: overrides.cost ?? 2,
    tags: overrides.tags ?? [],
    artworkUrl: '',
    effects: overrides.effects ?? [],
    linkedTrackIds: [],
    rightsStatus: 'placeholder',
    isPlayable: true,
    active: true,
    isToken: false,
    resonanceTier: 0,
    attack: overrides.attack ?? 2,
    health: overrides.health ?? 2,
  };
}

interface SimpleCardOverrides {
  id?: string;
  slug?: string;
  name?: string;
  rarity?: Rarity;
  cost?: number;
  tags?: string[];
  effects?: EffectDefinition[];
}

export function makeEvent(overrides: SimpleCardOverrides = {}): EventCard {
  const id = overrides.id ?? nextId('event');
  return {
    id,
    slug: overrides.slug ?? id,
    name: overrides.name ?? id,
    type: 'EVENT',
    rarity: overrides.rarity ?? 'COMMON',
    cost: overrides.cost ?? 1,
    tags: overrides.tags ?? [],
    artworkUrl: '',
    effects: overrides.effects ?? [],
    linkedTrackIds: [],
    rightsStatus: 'placeholder',
    isPlayable: true,
    active: true,
    isToken: false,
    resonanceTier: 0,
  };
}

export function makeTrack(overrides: SimpleCardOverrides = {}): TrackCard {
  const id = overrides.id ?? nextId('track');
  return {
    id,
    slug: overrides.slug ?? id,
    name: overrides.name ?? id,
    type: 'TRACK',
    rarity: overrides.rarity ?? 'COMMON',
    cost: overrides.cost ?? 1,
    tags: overrides.tags ?? [],
    artworkUrl: '',
    coverUrl: '',
    effects: overrides.effects ?? [],
    linkedTrackIds: [],
    rightsStatus: 'placeholder',
    isPlayable: true,
    active: true,
    isToken: false,
    resonanceTier: 0,
  };
}

export function makeRune(overrides: SimpleCardOverrides = {}): RuneCard {
  const id = overrides.id ?? nextId('rune');
  return {
    id,
    slug: overrides.slug ?? id,
    name: overrides.name ?? id,
    type: 'RUNE',
    rarity: overrides.rarity ?? 'COMMON',
    cost: overrides.cost ?? 1,
    tags: overrides.tags ?? [],
    artworkUrl: '',
    effects: overrides.effects ?? [],
    linkedTrackIds: [],
    rightsStatus: 'placeholder',
    isPlayable: true,
    active: true,
    isToken: false,
    resonanceTier: 0,
  };
}

export function makeContext(cards: Card[]): MatchContext {
  return { rulesVersion: 'test', cards: new Map(cards.map((c) => [c.id, c])) };
}

export function makeUnit(
  overrides: Partial<UnitInstance> & { ownerId: string; cardId: string },
): UnitInstance {
  return {
    instanceId: overrides.instanceId ?? nextId('unit'),
    cardId: overrides.cardId,
    ownerId: overrides.ownerId,
    attack: overrides.attack ?? 2,
    health: overrides.health ?? 2,
    maxHealth: overrides.maxHealth ?? overrides.health ?? 2,
    statuses: overrides.statuses ?? [],
    summonedThisTurn: overrides.summonedThisTurn ?? false,
    attackedThisTurn: overrides.attackedThisTurn ?? false,
  };
}

function makePlayer(playerId: string, overrides: Partial<PlayerMatchState> = {}): PlayerMatchState {
  return {
    playerId,
    conductorHp: overrides.conductorHp ?? STARTING_CONDUCTOR_HP,
    energy: overrides.energy ?? 5,
    maxEnergy: overrides.maxEnergy ?? 5,
    hand: overrides.hand ?? [],
    deck: overrides.deck ?? [],
    discard: overrides.discard ?? [],
    board: overrides.board ?? [],
    runes: overrides.runes ?? [],
    fatigueDamage: overrides.fatigueDamage ?? 0,
    cardsPlayedThisTurn: overrides.cardsPlayedThisTurn ?? 0,
    turnCostModifiers: overrides.turnCostModifiers ?? [],
  };
}

export interface BareMatchOptions {
  matchId?: string;
  seed?: string;
  turn?: number;
  activePlayerId: string;
  player1: { playerId: string } & Partial<PlayerMatchState>;
  player2: { playerId: string } & Partial<PlayerMatchState>;
}

export function makeBareMatchState(options: BareMatchOptions): MatchState {
  const p1 = makePlayer(options.player1.playerId, options.player1);
  const p2 = makePlayer(options.player2.playerId, options.player2);
  return {
    matchId: options.matchId ?? 'match-test',
    seed: options.seed ?? 'seed-test',
    rulesVersion: 'test',
    turn: options.turn ?? 1,
    activePlayerId: options.activePlayerId,
    players: { [p1.playerId]: p1, [p2.playerId]: p2 },
    boostSnapshot: [],
    actionSequence: 0,
    instanceCounter: 1000,
    effectUsage: {},
    pendingEndOfTurnReverts: [],
    finished: false,
  };
}
