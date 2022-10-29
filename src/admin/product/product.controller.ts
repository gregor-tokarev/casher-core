import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminPermissions } from '../entities/admin-user.entity';
import { Product } from '@core/entities/product.entity';
import { Permissions } from '../auth/decorators/set-permission.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { AdminProductService } from './services/product.service';
import { GetAdminUser } from '../auth/decorators/get-user.decorator';
import { UpdateProductDto } from './dto/update-product.dto';
import { SearchProductsDto } from './dto/search-products.dto';
import { ProductService } from '@core/services/product.service';
import { ReviewService } from '@core/services/review.service';
import { Review } from '@core/entities/review.entity';

@UseGuards(AuthGuard('jwt-admin-access'))
@Controller('admin/product')
export class ProductController {
  constructor(
    private readonly adminProductService: AdminProductService,
    private readonly productService: ProductService,
    private readonly reviewService: ReviewService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async getProducts(@Query() query: SearchProductsDto): Promise<Product[]> {
    return this.adminProductService.search(query);
  }

  @HttpCode(HttpStatus.CREATED)
  @Permissions(AdminPermissions.CREATE_PRODUCTS)
  @Post()
  async createProduct(
    @GetAdminUser('sub') adminId: string,
    @Body() createProductDto: CreateProductDto,
  ): Promise<Product> {
    return this.adminProductService.create(adminId, createProductDto);
  }

  @HttpCode(HttpStatus.OK)
  @Permissions(AdminPermissions.UPDATE_PRODUCTS)
  @Put('/:productId')
  async updateProduct(
    @Param('productId') productId: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    await this.productService.findByOrFail({ id: productId }); // checks existence

    return this.adminProductService.update(productId, updateProductDto);
  }

  @HttpCode(HttpStatus.OK)
  @Permissions(AdminPermissions.DELETE_PRODUCTS)
  @Delete('/:productId')
  async deleteProduct(@Param('productId') productId: string): Promise<Product> {
    const product = await this.productService.findByOrFail({
      id: productId,
    });

    await this.adminProductService.delete(productId);

    return product;
  }

  @HttpCode(HttpStatus.OK)
  @Get(':product_id/reviews')
  async getReviews(
    @Param('product_id', ParseUUIDPipe) productId: string,
  ): Promise<Review[]> {
    return this.reviewService.getProductReviews(productId);
  }
}
