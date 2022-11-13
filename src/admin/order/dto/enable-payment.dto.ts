import { IsJSON, IsOptional } from 'class-validator';

export class EnablePaymentDto {
  @IsJSON()
  @IsOptional()
  credentials?: string;
}
