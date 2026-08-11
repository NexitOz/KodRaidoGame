/**
 * First Player Experience 1.0: tutorial progress persisted per-user, survives
 * refresh/logout/reconnect. `currentStep` is a plain client-driven bookmark (the
 * client owns objective evaluation - see docs/tutorial-fpx.md) purely so a
 * refreshed page can resume the overlay near where the player left off; it is
 * never used server-side to gate anything security-relevant.
 */
export interface TutorialProgress {
  startedAt?: string;
  completedAt?: string;
  skippedAt?: string;
  currentStep: number | null;
  /** True once the one-time completion reward has actually been granted. */
  rewardClaimed: boolean;
  /** The player's in-progress tutorial match, if any (for resume-after-refresh). */
  activeMatchId?: string;
}

export interface TutorialStartResponse extends TutorialProgress {
  matchId: string;
}

export interface TutorialCompleteResponse {
  rewardGranted: boolean;
  xp: number;
  softCurrency: number;
}
