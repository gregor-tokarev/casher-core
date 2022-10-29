import {
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class UpdateReviewDto {
  @Min(0)
  @Max(5)
  @IsNumber()
  @IsOptional()
  score?: number;

  @Length(20, 20000)
  @IsString()
  @IsOptional()
  content?: string;
}
