import { Module } from '@nestjs/common';
import { MatchRewardService } from './match-reward.service';
import { ProgressionService } from './progression.service';

@Module({
  providers: [MatchRewardService, ProgressionService],
  exports: [MatchRewardService, ProgressionService],
})
export class ProgressionModule {}
