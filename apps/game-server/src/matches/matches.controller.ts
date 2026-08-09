import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';
import { CreateMatchDto } from './dto/create-match.dto';
import { MatchActionDto } from './dto/match-action.dto';
import { MatchesService } from './matches.service';

@UseGuards(JwtAuthGuard)
@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post('pve')
  createPveMatch(@CurrentUser() user: JwtPayload, @Body() dto: CreateMatchDto) {
    return this.matchesService.createPveMatch(user.sub, dto.deckId, dto.difficulty);
  }

  @Get(':id')
  getMatch(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.matchesService.getView(user.sub, id);
  }

  @Post(':id/actions')
  applyAction(@CurrentUser() user: JwtPayload, @Param('id') id: string, @Body() dto: MatchActionDto) {
    return this.matchesService.applyPlayerAction(user.sub, id, dto);
  }
}
