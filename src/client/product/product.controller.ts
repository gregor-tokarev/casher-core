import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ProductService } from '@core/services/product.service';
import { Product } from '@core/entities/product.entity';
import { ClientSearchProductsDto } from './dto/search-products.dto';

@Controller('client/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async getProducts(
    @Query() query: ClientSearchProductsDto,
  ): Promise<Product[]> {
    return this.productService.search(query);
  }
}
