import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';
import { DecksService } from './decks.service';
import { UpsertDeckDto } from './dto/upsert-deck.dto';

@UseGuards(JwtAuthGuard)
@Controller('me/decks')
export class DecksController {
  constructor(private readonly decksService: DecksService) {}

  @Get()
  list(@CurrentUser() user: JwtPayload) {
    return this.decksService.list(user.sub);
  }

  @Post()
  create(@CurrentUser() user: JwtPayload, @Body() dto: UpsertDeckDto) {
    return this.decksService.create(user.sub, dto);
  }

  @Put(':id')
  update(@CurrentUser() user: JwtPayload, @Param('id') id: string, @Body() dto: UpsertDeckDto) {
    return this.decksService.update(user.sub, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.decksService.remove(user.sub, id);
  }
}
