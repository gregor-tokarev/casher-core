import { Product } from '../../../core/entities/product.entity';
import {
  IsIn,
  IsJSON,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateProductDto {
  @MaxLength(1000)
  @IsNotEmpty()
  title: string;

  @Length(20, 10000)
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsOptional()
  priceWithDiscount?: number;

  @IsIn(['ruble', 'dollar'])
  @IsNotEmpty()
  priceCurrency: Product['priceCurrency'];

  @IsJSON()
  @IsOptional()
  additionalFields?: string;
}
