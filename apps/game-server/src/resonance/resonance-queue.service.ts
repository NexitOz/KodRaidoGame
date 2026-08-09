import { Injectable, type OnModuleDestroy } from '@nestjs/common';
import { Queue } from 'bullmq';
import { RESONANCE_QUEUE_NAME, type ResonanceRecalculateJobData } from '@kod-raido/shared';
import { RedisService } from '../redis/redis.service';

/** Producer side of the resonance-recalculate queue; apps/worker consumes it. */
@Injectable()
export class ResonanceQueueService implements OnModuleDestroy {
  private readonly queue: Queue<ResonanceRecalculateJobData>;

  constructor(private readonly redis: RedisService) {
    this.queue = new Queue<ResonanceRecalculateJobData>(RESONANCE_QUEUE_NAME, {
      connection: this.redis,
    });
  }

  /** Pass a card id to recalculate just that card, or 'ALL' for the whole catalog. */
  async enqueueRecalculate(cardId: string): Promise<void> {
    await this.queue.add('recalculate', { cardId, requestedAt: new Date().toISOString() });
  }

  async onModuleDestroy(): Promise<void> {
    await this.queue.close();
  }
}
