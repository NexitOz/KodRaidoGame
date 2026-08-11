import type { Card, Deck } from '@kod-raido/shared';

/**
 * Majority faction among a deck's own cards - purely a Deck Select display heuristic (section 10
 * of visual-polish-01), no balance meaning and no persisted field. NEUTRAL cards never count
 * toward a faction, so an all-neutral deck correctly reports no dominant faction.
 */
export function dominantFaction(deck: Deck, cardsById: Map<string, Card>): string | null {
  const counts = new Map<string, number>();
  for (const entry of deck.cards) {
    const card = cardsById.get(entry.cardId);
    if (!card || card.faction === 'NEUTRAL') continue;
    counts.set(card.faction, (counts.get(card.faction) ?? 0) + entry.quantity);
  }
  let best: string | null = null;
  let bestCount = 0;
  for (const [faction, count] of counts) {
    if (count > bestCount) {
      best = faction;
      bestCount = count;
    }
  }
  return best;
}
