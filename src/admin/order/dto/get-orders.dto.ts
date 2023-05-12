import { IsNumber, IsOptional } from 'class-validator';

export class GetOrdersDto {
  @IsNumber()
  @IsOptional()
  skip = 0;

  @IsNumber()
  @IsOptional()
  take = 20;
}
