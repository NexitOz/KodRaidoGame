import { Queue } from 'bullmq';
import type { Redis } from 'ioredis';

export const RESONANCE_QUEUE_NAME = 'resonance-recalculate';

export interface ResonanceRecalculateJobData {
  /** Card id to recalculate, or 'ALL' to recalculate the full catalog. */
  cardId: string;
  requestedAt: string;
}

export function createResonanceQueue(connection: Redis): Queue<ResonanceRecalculateJobData> {
  return new Queue<ResonanceRecalculateJobData>(RESONANCE_QUEUE_NAME, { connection });
}
