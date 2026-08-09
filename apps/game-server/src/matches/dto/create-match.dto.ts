import { IsIn, IsString } from 'class-validator';

export class CreateMatchDto {
  @IsString()
  deckId!: string;

  @IsIn(['EASY', 'NORMAL', 'HARD'])
  difficulty!: 'EASY' | 'NORMAL' | 'HARD';
}
