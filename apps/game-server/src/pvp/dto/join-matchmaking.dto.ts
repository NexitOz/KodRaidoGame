import { IsString } from 'class-validator';

export class JoinMatchmakingDto {
  @IsString()
  deckId!: string;
}
