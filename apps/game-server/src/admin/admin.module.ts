import { Module } from '@nestjs/common';
import { ResonanceQueueModule } from '../resonance/resonance-queue.module';
import { AdminController } from './admin.controller';
import { AdminMetricsService } from './admin-metrics.service';
import { AdminKeyGuard } from './guards/admin-key.guard';

@Module({
  imports: [ResonanceQueueModule],
  controllers: [AdminController],
  providers: [AdminMetricsService, AdminKeyGuard],
})
export class AdminModule {}
