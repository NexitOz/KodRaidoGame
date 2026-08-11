import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AdminKeyGuard } from './guards/admin-key.guard';

@UseGuards(AdminKeyGuard)
@Controller('admin/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('summary')
  getSummary() {
    return this.analyticsService.getSummary();
  }

  /** Player Progression & Economy 1.0 admin visibility - see AnalyticsService.getRecentMatchRewards. */
  @Get('rewards')
  getRecentMatchRewards(@Query('limit') limit?: string) {
    const parsed = limit ? Number(limit) : undefined;
    return this.analyticsService.getRecentMatchRewards(parsed && parsed > 0 ? Math.min(parsed, 100) : undefined);
  }

  /** Canonical Card Roster 1.0 admin visibility - see AnalyticsService.getCards. */
  @Get('cards')
  getCards(@Query('status') status?: string) {
    const normalized = status === 'active' || status === 'archived' ? status : 'all';
    return this.analyticsService.getCards(normalized);
  }
}
