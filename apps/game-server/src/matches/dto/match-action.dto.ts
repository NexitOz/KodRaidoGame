import { IsIn, IsOptional, IsString } from 'class-validator';

export class MatchActionDto {
  @IsIn(['PLAY_CARD', 'ATTACK', 'END_TURN'])
  type!: 'PLAY_CARD' | 'ATTACK' | 'END_TURN';

  @IsOptional()
  @IsString()
  cardId?: string;

  @IsOptional()
  @IsString()
  attackerId?: string;

  @IsOptional()
  @IsString()
  targetId?: string;
}
