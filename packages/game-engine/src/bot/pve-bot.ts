import { MAX_BOARD_UNITS, type Card } from '@kod-raido/shared';
import { createRng, pickRandom } from '../rng.js';
import { previewEffectiveCost } from '../match/cost.js';
import type {
  CardInstance,
  GameAction,
  MatchContext,
  MatchState,
  UnitInstance,
} from '../match/types.js';
import { getOpponentId } from '../match/util.js';

export type BotDifficulty = 'EASY' | 'NORMAL' | 'HARD';

function readyAttackers(unit: UnitInstance): boolean {
  return !unit.attackedThisTurn && (!unit.summonedThisTurn || unit.statuses.includes('IMPULSE'));
}

function affordableCards(
  state: MatchState,
  matchCtx: MatchContext,
  playerId: string,
): Array<{ instance: CardInstance; card: Card }> {
  const player = state.players[playerId]!;
  const entries: Array<{ instance: CardInstance; card: Card }> = [];
  for (const instance of player.hand) {
    const card = matchCtx.cards.get(instance.cardId);
    if (!card || !card.active || !card.isPlayable) continue;
    if (card.type === 'CHARACTER' && player.board.length >= MAX_BOARD_UNITS) continue;
    const { cost } = previewEffectiveCost(state, playerId, card.cost, card.tags);
    if (cost > player.energy) continue;
    entries.push({ instance, card });
  }
  return entries;
}

function scoreCard(card: Card): number {
  // Simple tempo heuristic: spend as much energy as profitably possible each turn,
  // favouring board presence (Characters) over one-shot effects when costs tie.
  return card.cost * 10 + (card.type === 'CHARACTER' ? 1 : 0);
}

function pickTargetForCard(
  state: MatchState,
  matchCtx: MatchContext,
  botPlayerId: string,
  card: Card,
  rng: () => number,
): string | undefined {
  const needsTarget = card.effects.some(
    (def) =>
      def.trigger === 'ON_PLAY' &&
      def.effects.some((e) => e.target === 'ENEMY_CHOSEN' || e.target === 'FRIENDLY_CHOSEN'),
  );
  if (!needsTarget) return undefined;

  const opponentId = getOpponentId(state, botPlayerId);
  const bot = state.players[botPlayerId]!;
  const opponent = state.players[opponentId]!;

  const isDamage = card.effects.some((def) =>
    def.effects.some((e) => e.type === 'DAMAGE' || e.type === 'SILENCE'),
  );
  if (isDamage) {
    const visible = opponent.board.filter((u) => !u.statuses.includes('HIDDEN'));
    const strongest = [...visible].sort((a, b) => b.attack - a.attack)[0];
    return strongest?.instanceId ?? opponentId;
  }

  const isHeal = card.effects.some((def) =>
    def.effects.some((e) => e.type === 'HEAL' || e.type === 'BUFF' || e.type === 'SHIELD'),
  );
  if (isHeal) {
    const wounded = [...bot.board].sort((a, b) => a.health - b.health)[0];
    return wounded?.instanceId ?? pickRandom(bot.board, rng)?.instanceId ?? botPlayerId;
  }

  return undefined;
}

function randomAction(
  state: MatchState,
  matchCtx: MatchContext,
  botPlayerId: string,
  rng: () => number,
): GameAction {
  const bot = state.players[botPlayerId]!;
  const opponentId = getOpponentId(state, botPlayerId);
  const options: GameAction[] = [];

  for (const { instance, card } of affordableCards(state, matchCtx, botPlayerId)) {
    options.push({
      type: 'PLAY_CARD',
      playerId: botPlayerId,
      cardId: instance.instanceId,
      targetId: pickTargetForCard(state, matchCtx, botPlayerId, card, rng),
    });
  }
  for (const unit of bot.board.filter(readyAttackers)) {
    options.push({
      type: 'ATTACK',
      playerId: botPlayerId,
      attackerId: unit.instanceId,
      targetId: opponentId,
    });
  }

  const choice = pickRandom(options, rng);
  return choice ?? { type: 'END_TURN', playerId: botPlayerId };
}

/**
 * Decides a single next action for the bot. Callers repeatedly call this and
 * feed the result into `applyAction` until it returns END_TURN, matching the
 * one-action-per-call shape of the authoritative engine.
 */
export function chooseBotAction(
  state: MatchState,
  matchCtx: MatchContext,
  botPlayerId: string,
  difficulty: BotDifficulty = 'NORMAL',
): GameAction {
  const rng = createRng(`${state.seed}:bot:${state.actionSequence}:${botPlayerId}`);
  const bot = state.players[botPlayerId];
  const opponentId = getOpponentId(state, botPlayerId);
  const opponent = state.players[opponentId];
  if (!bot || !opponent) return { type: 'END_TURN', playerId: botPlayerId };

  if (difficulty === 'EASY') {
    return randomAction(state, matchCtx, botPlayerId, rng);
  }

  const attackers = bot.board.filter(readyAttackers);

  // 1. Lethal — a single attacker that ends it, or the biggest attacker en route to lethal this turn.
  const directLethal = attackers.find((u) => u.attack >= opponent.conductorHp);
  if (directLethal) {
    return {
      type: 'ATTACK',
      playerId: botPlayerId,
      attackerId: directLethal.instanceId,
      targetId: opponentId,
    };
  }
  const totalReadyAttack = attackers.reduce((sum, u) => sum + u.attack, 0);
  if (attackers.length > 0 && totalReadyAttack >= opponent.conductorHp) {
    const biggest = [...attackers].sort((a, b) => b.attack - a.attack)[0]!;
    return {
      type: 'ATTACK',
      playerId: botPlayerId,
      attackerId: biggest.instanceId,
      targetId: opponentId,
    };
  }

  // 2. Favourable trade.
  const enemyTargets = opponent.board.filter((u) => !u.statuses.includes('HIDDEN'));
  let bestTrade: { attacker: UnitInstance; defender: UnitInstance } | undefined;
  for (const attacker of attackers) {
    for (const defender of enemyTargets) {
      const kills = attacker.attack >= defender.health;
      if (!kills) continue;
      const survives = defender.attack < attacker.health;
      const worthTradingDown =
        difficulty === 'HARD' &&
        defender.attack + defender.health > attacker.attack + attacker.health;
      if (!survives && !worthTradingDown) continue;
      if (!bestTrade || defender.attack > bestTrade.defender.attack) {
        bestTrade = { attacker, defender };
      }
    }
  }
  if (bestTrade) {
    return {
      type: 'ATTACK',
      playerId: botPlayerId,
      attackerId: bestTrade.attacker.instanceId,
      targetId: bestTrade.defender.instanceId,
    };
  }

  // 3. Best affordable card play.
  const playable = affordableCards(state, matchCtx, botPlayerId);
  if (playable.length > 0) {
    const [best] = [...playable].sort((a, b) => scoreCard(b.card) - scoreCard(a.card));
    const targetId = pickTargetForCard(state, matchCtx, botPlayerId, best!.card, rng);
    return {
      type: 'PLAY_CARD',
      playerId: botPlayerId,
      cardId: best!.instance.instanceId,
      targetId,
    };
  }

  // 4. Attack the Conductor with whatever is left.
  if (attackers.length > 0) {
    return {
      type: 'ATTACK',
      playerId: botPlayerId,
      attackerId: attackers[0]!.instanceId,
      targetId: opponentId,
    };
  }

  // 5. Nothing left to do.
  return { type: 'END_TURN', playerId: botPlayerId };
}
