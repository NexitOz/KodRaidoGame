import { Module } from '@nestjs/common';
import { MatchesModule } from '../matches/matches.module';
import { TutorialController } from './tutorial.controller';
import { TutorialService } from './tutorial.service';

@Module({
  imports: [MatchesModule],
  controllers: [TutorialController],
  providers: [TutorialService],
})
export class TutorialModule {}
