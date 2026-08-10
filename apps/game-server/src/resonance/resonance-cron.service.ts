import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ResonanceQueueService } from './resonance-queue.service';

@Injectable()
export class ResonanceCronService {
  constructor(private readonly resonanceQueue: ResonanceQueueService) {}

  @Cron('0 3 * * *') // once daily at 03:00 server time
  async triggerDailyRecalculation(): Promise<void> {
    await this.resonanceQueue.enqueueRecalculate('ALL');
  }
}
