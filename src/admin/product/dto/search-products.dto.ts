import { IsOptional, IsString } from 'class-validator';

export class SearchProductsDto {
  @IsOptional()
  top?: number;

  @IsOptional()
  skip?: number;

  @IsString()
  q: string;
}
