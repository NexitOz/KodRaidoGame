import { Module } from '@nestjs/common';
import { DecksController } from './decks.controller';
import { DecksService } from './decks.service';
import { StarterDeckProvisioningService } from './starter-deck-provisioning.service';

@Module({
  controllers: [DecksController],
  providers: [DecksService, StarterDeckProvisioningService],
  exports: [StarterDeckProvisioningService],
})
export class DecksModule {}
