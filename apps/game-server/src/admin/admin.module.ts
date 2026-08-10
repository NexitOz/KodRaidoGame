import { Module } from '@nestjs/common';
import { ResonanceQueueModule } from '../resonance/resonance-queue.module';
import { AdminController } from './admin.controller';
import { AdminMetricsService } from './admin-metrics.service';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { AdminKeyGuard } from './guards/admin-key.guard';

@Module({
  imports: [ResonanceQueueModule],
  controllers: [AdminController, AnalyticsController],
  providers: [AdminMetricsService, AnalyticsService, AdminKeyGuard],
})
export class AdminModule {}
