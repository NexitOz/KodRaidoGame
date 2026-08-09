import { Module } from '@nestjs/common';
import { ResonanceCronService } from './resonance-cron.service';
import { ResonanceQueueModule } from './resonance-queue.module';
import { ResonanceController } from './resonance.controller';
import { ResonanceService } from './resonance.service';

@Module({
  imports: [ResonanceQueueModule],
  controllers: [ResonanceController],
  providers: [ResonanceService, ResonanceCronService],
  exports: [ResonanceService],
})
export class ResonanceModule {}
