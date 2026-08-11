import { IsInt, Min } from 'class-validator';

export class TutorialStepDto {
  @IsInt()
  @Min(0)
  step!: number;
}
