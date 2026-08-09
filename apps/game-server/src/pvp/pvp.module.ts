import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MatchesModule } from '../matches/matches.module';
import { MatchGateway } from './match.gateway';
import { MatchmakingController } from './matchmaking.controller';
import { MatchmakingService } from './matchmaking.service';

@Module({
  imports: [
    MatchesModule,
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET ?? 'dev-insecure-secret-change-me',
    }),
  ],
  controllers: [MatchmakingController],
  providers: [MatchGateway, MatchmakingService],
})
export class PvpModule {}
