import { Module } from '@nestjs/common';
import { ResonanceModule } from '../resonance/resonance.module';
import { MatchStateRepository } from './match-state.repository';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';

@Module({
  imports: [ResonanceModule],
  controllers: [MatchesController],
  providers: [MatchesService, MatchStateRepository],
  exports: [MatchesService],
})
export class MatchesModule {}
