import { Product } from '@core/entities/product.entity';
import {
  IsIn,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class CreateProductDto {
  @MaxLength(1000)
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  price: number;

  @IsOptional()
  priceWithDiscount?: number;

  @IsIn(['ruble', 'dollar'])
  @IsNotEmpty()
  priceCurrency: Product['priceCurrency'];

  @IsJSON()
  @IsOptional()
  additionalFields?: string;
}
