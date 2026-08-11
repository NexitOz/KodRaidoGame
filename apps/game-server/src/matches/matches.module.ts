import { Module } from '@nestjs/common';
import { ProgressionModule } from '../progression/progression.module';
import { ResonanceModule } from '../resonance/resonance.module';
import { MatchStateRepository } from './match-state.repository';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';

@Module({
  imports: [ResonanceModule, ProgressionModule],
  controllers: [MatchesController],
  providers: [MatchesService, MatchStateRepository],
  exports: [MatchesService],
})
export class MatchesModule {}
