import { Worker, type Job } from 'bullmq';
import type { Redis } from 'ioredis';
import {
  RESONANCE_QUEUE_NAME,
  type ResonanceRecalculateJobData,
} from '../queues/resonance-queue.js';

/**
 * Phase 0/1 skeleton processor. Real Resonance scoring (Phase 5) will read
 * metric_snapshots and write resonance_snapshots here; for now it only
 * proves the queue/worker wiring end to end.
 */
export function createResonanceWorker(connection: Redis): Worker<ResonanceRecalculateJobData> {
  return new Worker<ResonanceRecalculateJobData>(
    RESONANCE_QUEUE_NAME,
    async (job: Job<ResonanceRecalculateJobData>) => {
      // eslint-disable-next-line no-console
      console.log(`[worker] resonance recalculate requested for card=${job.data.cardId}`);
      return { processed: true };
    },
    { connection },
  );
}
