import { Module } from '@nestjs/common';
import { MatchStateRepository } from './match-state.repository';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';

@Module({
  controllers: [MatchesController],
  providers: [MatchesService, MatchStateRepository],
  exports: [MatchesService],
})
export class MatchesModule {}
