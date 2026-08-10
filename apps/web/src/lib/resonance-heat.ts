import type { MatchStateView, ResonanceTier } from '@kod-raido/shared';

/**
 * There's no single "match resonance tier" field from the backend — Resonance
 * is per-card. This derives a compact viewer-facing signal from data already
 * on every card in the response (`resonanceTier`, denormalized since Phase
 * 5): the hottest tier among the cards the viewer currently has in hand or
 * on the board. Purely a read of existing data — no balance change.
 */
export function computeViewerResonanceHeat(view: MatchStateView): ResonanceTier {
  let max: ResonanceTier = 0;
  for (const unit of view.you.board) {
    if (unit.card.resonanceTier > max) max = unit.card.resonanceTier;
  }
  for (const { card } of view.you.hand) {
    if (card.resonanceTier > max) max = card.resonanceTier;
  }
  return max;
}
