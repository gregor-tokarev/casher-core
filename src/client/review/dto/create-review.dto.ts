import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateReviewDto {
  @Min(0)
  @Max(5)
  @IsNumber()
  @IsNotEmpty()
  score: number;

  @Length(20, 20000)
  @IsString()
  @IsNotEmpty()
  content: string;
}
