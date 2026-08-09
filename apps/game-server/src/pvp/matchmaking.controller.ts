import { Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';
import { JoinMatchmakingDto } from './dto/join-matchmaking.dto';
import { MatchmakingService } from './matchmaking.service';

@UseGuards(JwtAuthGuard)
@Controller('matchmaking')
export class MatchmakingController {
  constructor(private readonly matchmaking: MatchmakingService) {}

  @Post('join')
  async join(@CurrentUser() user: JwtPayload, @Body() dto: JoinMatchmakingDto) {
    await this.matchmaking.join(user.sub, dto.deckId);
    return { queued: true };
  }

  @Post('leave')
  @HttpCode(200)
  async leave(@CurrentUser() user: JwtPayload) {
    await this.matchmaking.leave(user.sub);
    return { queued: false };
  }

  @Get('status')
  status(@CurrentUser() user: JwtPayload) {
    return this.matchmaking.status(user.sub);
  }
}
