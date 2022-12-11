import { IsOptional, IsString } from 'class-validator';

export class ClientSearchProductsDto {
  @IsOptional()
  top?: number;

  @IsOptional()
  skip?: number;

  @IsString()
  q: string;
}
