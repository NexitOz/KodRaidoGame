import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';
import { MatchesService } from '../matches/matches.service';
import { MeService } from './me.service';

@UseGuards(JwtAuthGuard)
@Controller('me')
export class MeController {
  constructor(
    private readonly meService: MeService,
    private readonly matchesService: MatchesService,
  ) {}

  @Get()
  getMe(@CurrentUser() user: JwtPayload) {
    return this.meService.getProfile(user.sub);
  }

  @Get('collection')
  getCollection(@CurrentUser() user: JwtPayload) {
    return this.meService.getCollection(user.sub);
  }

  @Get('matches')
  getMatchHistory(@CurrentUser() user: JwtPayload) {
    return this.matchesService.listHistory(user.sub);
  }
}
