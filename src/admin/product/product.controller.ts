import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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

@UseGuards(AuthGuard('jwt-admin-access'))
@Controller('admin/product')
export class ProductController {
  constructor(private readonly adminProductService: AdminProductService) {}

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
    await this.adminProductService.findByOrFail({ id: productId }); // checks existence

    return this.adminProductService.update(productId, updateProductDto);
  }

  @HttpCode(HttpStatus.OK)
  @Permissions(AdminPermissions.DELETE_PRODUCTS)
  @Delete('/:productId')
  async deleteProduct(@Param('productId') productId: string): Promise<Product> {
    const product = await this.adminProductService.findByOrFail({
      id: productId,
    });

    await this.adminProductService.delete(productId);

    return product;
  }
}
