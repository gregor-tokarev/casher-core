import { Product } from '@core/entities/product.entity';

export class AdminProductResponseDto extends Product {
  revenue: number;
  soldCount: number;
  overallRating: number;
}
