import { Controller, Get, Param } from '@nestjs/common';
import { ResonanceService } from './resonance.service';

@Controller('resonance')
export class ResonanceController {
  constructor(private readonly resonanceService: ResonanceService) {}

  @Get()
  getAll() {
    return this.resonanceService.getAll();
  }

  @Get('trending')
  getTrending() {
    return this.resonanceService.getTrending();
  }

  @Get(':cardId/history')
  getHistory(@Param('cardId') cardId: string) {
    return this.resonanceService.getHistory(cardId);
  }
}
