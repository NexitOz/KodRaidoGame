import { Queue } from 'bullmq';
import type { Redis } from 'ioredis';
import { RESONANCE_QUEUE_NAME, type ResonanceRecalculateJobData } from '@kod-raido/shared';

export { RESONANCE_QUEUE_NAME, type ResonanceRecalculateJobData };

export function createResonanceQueue(connection: Redis): Queue<ResonanceRecalculateJobData> {
  return new Queue<ResonanceRecalculateJobData>(RESONANCE_QUEUE_NAME, { connection });
}
