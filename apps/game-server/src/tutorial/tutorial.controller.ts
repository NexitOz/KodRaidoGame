import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';
import { TutorialStepDto } from './dto/tutorial-step.dto';
import { TutorialService } from './tutorial.service';

@UseGuards(JwtAuthGuard)
@Controller('me/tutorial')
export class TutorialController {
  constructor(private readonly tutorial: TutorialService) {}

  @Get()
  getProgress(@CurrentUser() user: JwtPayload) {
    return this.tutorial.getProgress(user.sub);
  }

  @Post('start')
  start(@CurrentUser() user: JwtPayload) {
    return this.tutorial.start(user.sub);
  }

  @Post('progress')
  saveProgress(@CurrentUser() user: JwtPayload, @Body() dto: TutorialStepDto) {
    return this.tutorial.saveStep(user.sub, dto.step);
  }

  @Post('complete')
  complete(@CurrentUser() user: JwtPayload) {
    return this.tutorial.complete(user.sub);
  }

  @Post('skip')
  skip(@CurrentUser() user: JwtPayload) {
    return this.tutorial.skip(user.sub);
  }
}
