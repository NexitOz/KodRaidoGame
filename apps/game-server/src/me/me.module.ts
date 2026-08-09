import { Module } from '@nestjs/common';
import { MatchesModule } from '../matches/matches.module';
import { MeController } from './me.controller';
import { MeService } from './me.service';

@Module({
  imports: [MatchesModule],
  controllers: [MeController],
  providers: [MeService],
})
export class MeModule {}
