import { Product } from '@core/entities/product.entity';

export class AdminProductsResponse extends Product {
  revenue: number;
  soldCount: number;
  overallRating: number;
}

export class AdminProductResponseDto {
  products: AdminProductsResponse[];
  count: number;
}
