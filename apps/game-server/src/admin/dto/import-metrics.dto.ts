import { IsString } from 'class-validator';

export class ImportMetricsDto {
  @IsString()
  csv!: string;
}
