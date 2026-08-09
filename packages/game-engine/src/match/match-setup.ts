import {
  MAX_ENERGY,
  SECOND_PLAYER_COMPENSATION_CARDS,
  STARTING_CONDUCTOR_HP,
  STARTING_HAND_SIZE,
  type BoostSnapshotEntry,
  type DeckCardEntry,
} from '@kod-raido/shared';
import { createRng, shuffle } from '../rng.js';
import type { CardInstance, MatchState, PlayerMatchState } from './types.js';

export interface CreateMatchInput {
  matchId: string;
  seed: string;
  rulesVersion: string;
  player1: { playerId: string; deck: DeckCardEntry[] };
  player2: { playerId: string; deck: DeckCardEntry[] };
  boostSnapshot?: BoostSnapshotEntry[];
}

function expandDeck(entries: DeckCardEntry[], state: MatchState): CardInstance[] {
  const instances: CardInstance[] = [];
  for (const entry of entries) {
    for (let i = 0; i < entry.quantity; i += 1) {
      state.instanceCounter += 1;
      instances.push({ instanceId: `card-${state.instanceCounter}`, cardId: entry.cardId });
    }
  }
  return instances;
}

function createPlayerState(playerId: string, deck: CardInstance[]): PlayerMatchState {
  return {
    playerId,
    conductorHp: STARTING_CONDUCTOR_HP,
    energy: 0,
    maxEnergy: 0,
    hand: [],
    deck,
    discard: [],
    board: [],
    runes: [],
    fatigueDamage: 0,
    cardsPlayedThisTurn: 0,
    turnCostModifiers: [],
  };
}

export function createMatch(input: CreateMatchInput): MatchState {
  const state: MatchState = {
    matchId: input.matchId,
    seed: input.seed,
    rulesVersion: input.rulesVersion,
    turn: 1,
    activePlayerId: input.player1.playerId,
    players: {},
    boostSnapshot: input.boostSnapshot ?? [],
    actionSequence: 0,
    instanceCounter: 0,
    effectUsage: {},
    pendingEndOfTurnReverts: [],
    finished: false,
  };

  const deck1 = expandDeck(input.player1.deck, state);
  const deck2 = expandDeck(input.player2.deck, state);

  const rng = createRng(`${input.seed}:setup`);
  const shuffled1 = shuffle(deck1, rng);
  const shuffled2 = shuffle(deck2, rng);

  const p1 = createPlayerState(input.player1.playerId, shuffled1);
  const p2 = createPlayerState(input.player2.playerId, shuffled2);
  state.players[p1.playerId] = p1;
  state.players[p2.playerId] = p2;

  const firstPlayerId = rng() < 0.5 ? p1.playerId : p2.playerId;
  const secondPlayerId = firstPlayerId === p1.playerId ? p2.playerId : p1.playerId;
  state.activePlayerId = firstPlayerId;

  for (const player of [p1, p2]) {
    for (let i = 0; i < STARTING_HAND_SIZE; i += 1) {
      const card = player.deck.shift();
      if (card) player.hand.push(card);
    }
  }

  const second = state.players[secondPlayerId]!;
  for (let i = 0; i < SECOND_PLAYER_COMPENSATION_CARDS; i += 1) {
    const card = second.deck.shift();
    if (card) second.hand.push(card);
  }

  const active = state.players[firstPlayerId]!;
  active.maxEnergy = Math.min(MAX_ENERGY, state.turn);
  active.energy = active.maxEnergy;

  return state;
}
