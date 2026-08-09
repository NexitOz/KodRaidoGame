import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { CardsService } from './cards.service';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Get()
  findAll() {
    return this.cardsService.findAllPlayable();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const card = await this.cardsService.findOnePlayable(id);
    if (!card) throw new NotFoundException('Card not found.');
    return card;
  }
}
