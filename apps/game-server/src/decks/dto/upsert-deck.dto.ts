import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsInt,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class DeckCardEntryDto {
  @IsString()
  cardId!: string;

  @IsInt()
  @Min(1)
  @Max(2)
  quantity!: number;
}

export class UpsertDeckDto {
  @IsString()
  @MinLength(1)
  @MaxLength(40)
  name!: string;

  @ValidateNested({ each: true })
  @Type(() => DeckCardEntryDto)
  @ArrayMaxSize(30)
  cards!: DeckCardEntryDto[];
}
