import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReviewDto {
  @Min(0)
  @Max(5)
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  score: number;

  @Length(20, 20000)
  @IsString()
  @IsNotEmpty()
  content: string;
}
