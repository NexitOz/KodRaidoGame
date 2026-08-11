import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';
import { MatchesService } from '../matches/matches.service';
import { ProgressionService } from '../progression/progression.service';
import { MeService } from './me.service';

@UseGuards(JwtAuthGuard)
@Controller('me')
export class MeController {
  constructor(
    private readonly meService: MeService,
    private readonly matchesService: MatchesService,
    private readonly progressionService: ProgressionService,
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

  /**
   * Player Progression & Economy 1.0 (spec section 20 calls this GET /profile/progression -
   * implemented under the existing `/me` prefix instead, consistent with /me/collection,
   * /me/decks, /me/matches, /me/tutorial; documented in docs/player-progression-economy-01.md).
   */
  @Get('progression')
  getProgression(@CurrentUser() user: JwtPayload) {
    return this.progressionService.getProgressionView(user.sub);
  }
}
