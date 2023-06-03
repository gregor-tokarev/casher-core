import { IsArray, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class AdminSearchProductsDto {
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  top?: number;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  skip?: number;

  @IsString()
  q: string;

  @IsArray()
  @IsOptional()
  categories?: string[];
}
