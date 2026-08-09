import type { MatchContext, MatchState, PlayerMatchState } from '@kod-raido/game-engine';
import type { Card, MatchStateView, PlayerStateView } from '@kod-raido/shared';

function resolveCard(matchCtx: MatchContext, cardId: string): Card {
  const card = matchCtx.cards.get(cardId);
  if (!card) throw new Error(`Unknown card in match state: ${cardId}`);
  return card;
}

function buildPlayerView(
  player: PlayerMatchState,
  matchCtx: MatchContext,
  includeHand: boolean,
): PlayerStateView {
  return {
    playerId: player.playerId,
    isBot: player.playerId === 'bot',
    conductorHp: player.conductorHp,
    energy: player.energy,
    maxEnergy: player.maxEnergy,
    hand: includeHand
      ? player.hand.map((c) => ({ instanceId: c.instanceId, card: resolveCard(matchCtx, c.cardId) }))
      : [],
    handCount: player.hand.length,
    deckCount: player.deck.length,
    discardCount: player.discard.length,
    board: player.board.map((unit) => ({
      instanceId: unit.instanceId,
      card: resolveCard(matchCtx, unit.cardId),
      attack: unit.attack,
      health: unit.health,
      maxHealth: unit.maxHealth,
      statuses: unit.statuses,
      summonedThisTurn: unit.summonedThisTurn,
      attackedThisTurn: unit.attackedThisTurn,
    })),
    runeCardIds: player.runes,
  };
}

export function buildMatchView(state: MatchState, matchCtx: MatchContext, viewerId: string): MatchStateView {
  const you = state.players[viewerId];
  const opponentId = Object.keys(state.players).find((id) => id !== viewerId);
  if (!you || !opponentId) {
    throw new Error('Viewer is not a participant in this match.');
  }
  const opponent = state.players[opponentId]!;

  return {
    matchId: state.matchId,
    turn: state.turn,
    activePlayerId: state.activePlayerId,
    finished: state.finished,
    winnerId: state.winnerId,
    you: buildPlayerView(you, matchCtx, true),
    opponent: buildPlayerView(opponent, matchCtx, false),
  };
}
