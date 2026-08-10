import { Worker, type Job } from 'bullmq';
import type { Redis } from 'ioredis';
import type { PrismaClient } from '@prisma/client';
import { RESONANCE_QUEUE_NAME, type ResonanceRecalculateJobData } from '@kod-raido/shared';
import { recalculateAll, recalculateCard } from '../resonance/recalculate.js';

export function createResonanceWorker(
  connection: Redis,
  prisma: PrismaClient,
): Worker<ResonanceRecalculateJobData> {
  return new Worker<ResonanceRecalculateJobData>(
    RESONANCE_QUEUE_NAME,
    async (job: Job<ResonanceRecalculateJobData>) => {
      if (job.data.cardId === 'ALL') {
        const recalculated = await recalculateAll(prisma);
        return { processed: true, recalculated };
      }
      const didRecalculate = await recalculateCard(prisma, job.data.cardId);
      return { processed: true, recalculated: didRecalculate ? 1 : 0 };
    },
    { connection },
  );
}
