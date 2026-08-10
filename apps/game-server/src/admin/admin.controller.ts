import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AdminMetricsService } from './admin-metrics.service';
import { ImportMetricsDto } from './dto/import-metrics.dto';
import { AdminKeyGuard } from './guards/admin-key.guard';

@UseGuards(AdminKeyGuard)
@Controller('admin/metrics')
export class AdminController {
  constructor(private readonly adminMetricsService: AdminMetricsService) {}

  @Post('import')
  importCsv(@Body() dto: ImportMetricsDto) {
    return this.adminMetricsService.importCsv(dto.csv);
  }
}
