import { IsIn, IsString } from 'class-validator';

export class CreateMatchDto {
  @IsString()
  deckId!: string;

  // 'PRACTICE' is a deterministic no-op bot for automated e2e/integration tests only -
  // MatchesService.createPveMatch rejects it outside non-production environments.
  @IsIn(['EASY', 'NORMAL', 'HARD', 'PRACTICE'])
  difficulty!: 'EASY' | 'NORMAL' | 'HARD' | 'PRACTICE';
}
