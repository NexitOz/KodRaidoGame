import type { ResonanceTier } from './card.js';

export interface ResonanceSnapshot {
  id: string;
  cardId: string;
  score: number;
  tier: ResonanceTier;
  boostPercent: number;
  calculatedAt: string;
  validUntil: string;
  reasons: Record<string, number>;
}

export interface MetricSnapshot {
  id: string;
  mediaAssetId: string;
  capturedAt: string;
  views: number;
  listens: number;
  likes: number;
  comments: number;
  shares: number;
  soundUses: number;
  saves: number;
}

export const RESONANCE_TIER_THRESHOLDS: ReadonlyArray<{ tier: ResonanceTier; min: number }> = [
  { tier: 5, min: 90 },
  { tier: 4, min: 75 },
  { tier: 3, min: 60 },
  { tier: 2, min: 40 },
  { tier: 1, min: 20 },
  { tier: 0, min: 0 },
];

export function tierFromScore(score: number): ResonanceTier {
  const clamped = Math.max(0, Math.min(100, score));
  for (const entry of RESONANCE_TIER_THRESHOLDS) {
    if (clamped >= entry.min) return entry.tier;
  }
  return 0;
}

export const RANKED_BOOST_PERCENT_BY_TIER: Record<ResonanceTier, number> = {
  0: 0,
  1: 2,
  2: 4,
  3: 6,
  4: 8,
  5: 10,
};

export interface ResonanceScoreInputs {
  listensTrend: number;
  likesTrend: number;
  commentsTrend: number;
  sharesTrend: number;
  soundUsesTrend: number;
}

const SCORE_WEIGHTS: ResonanceScoreInputs = {
  listensTrend: 0.3,
  likesTrend: 0.2,
  commentsTrend: 0.15,
  sharesTrend: 0.2,
  soundUsesTrend: 0.15,
};

export function computeResonanceScore(inputs: ResonanceScoreInputs): number {
  const raw =
    inputs.listensTrend * SCORE_WEIGHTS.listensTrend +
    inputs.likesTrend * SCORE_WEIGHTS.likesTrend +
    inputs.commentsTrend * SCORE_WEIGHTS.commentsTrend +
    inputs.sharesTrend * SCORE_WEIGHTS.sharesTrend +
    inputs.soundUsesTrend * SCORE_WEIGHTS.soundUsesTrend;
  return Math.max(0, Math.min(100, Math.round(raw * 100) / 100));
}

/**
 * Percent growth of `current` over `previous`, clamped to [0, 100] so a
 * single runaway metric (e.g. a post going from 1 to 10,000 views) can't
 * blow out the weighted score above what `computeResonanceScore` already
 * clamps to. A metric with no prior-window activity reads as 100 (new
 * activity from nothing) or 0 (still nothing), never a division by zero.
 */
export function computeTrendPercent(current: number, previous: number): number {
  if (previous <= 0) return current > 0 ? 100 : 0;
  const change = ((current - previous) / previous) * 100;
  return Math.max(0, Math.min(100, Math.round(change * 100) / 100));
}

export interface CardResonanceView {
  cardId: string;
  slug: string;
  name: string;
  tier: ResonanceTier;
  score: number;
  boostPercent: number;
  calculatedAt?: string;
  /** Score delta vs the previous recalculation, when at least two snapshots exist. */
  scoreDelta?: number;
}

export interface ResonanceHistoryPoint {
  score: number;
  tier: ResonanceTier;
  calculatedAt: string;
}
