import { Module } from '@nestjs/common';
import { ResonanceQueueService } from './resonance-queue.service';

@Module({
  providers: [ResonanceQueueService],
  exports: [ResonanceQueueService],
})
export class ResonanceQueueModule {}
