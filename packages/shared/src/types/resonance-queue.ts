/**
 * Wire contract for the BullMQ resonance-recalculation queue, shared
 * between the producer (game-server, on metrics import / daily cron) and
 * the consumer (apps/worker) so the queue name and job payload can't drift.
 * Deliberately dependency-free (no bullmq import here) — each app builds
 * its own Queue/Worker instance around this shape.
 */
export const RESONANCE_QUEUE_NAME = 'resonance-recalculate';

export interface ResonanceRecalculateJobData {
  /** Card id to recalculate, or 'ALL' to recalculate the full catalog. */
  cardId: string;
  requestedAt: string;
}
