import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminPermissions } from '../entities/admin-user.entity';
import { Product } from '../../core/entities/product.entity';
import { Permissions } from '../auth/decorators/set-permission.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { AdminProductService } from './services/product.service';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UpdateProductDto } from './dto/update-product.dto';
import { productNotFound } from './errors';

@Controller('admin/product')
export class ProductController {
  constructor(private readonly productService: AdminProductService) {}

  @HttpCode(HttpStatus.CREATED)
  @Permissions(AdminPermissions.CREATE_PRODUCTS)
  @UseGuards(AuthGuard('jwt-admin-access'))
  @Post()
  async createProduct(
    @GetUser('sub') adminId: string,
    @Body() createProductDto: CreateProductDto,
  ): Promise<Product> {
    return this.productService.create(adminId, createProductDto);
  }

  @HttpCode(HttpStatus.OK)
  @Permissions(AdminPermissions.UPDATE_PRODUCTS)
  @UseGuards(AuthGuard('jwt-admin-access'))
  @Put('/:productId')
  async updateProduct(
    @Param('productId') productId: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    await this.productService.findById(productId); // checks existence

    return this.productService.update(productId, updateProductDto);
  }

  @HttpCode(HttpStatus.OK)
  @Permissions(AdminPermissions.DELETE_PRODUCTS)
  @UseGuards(AuthGuard('jwt-admin-access'))
  @Delete('/:productId')
  async deleteProduct(@Param('productId') productId: string): Promise<Product> {
    const product = await this.productService.findById(productId);
    if (!product) {
      throw new NotFoundException(productNotFound);
    }

    await this.productService.delete(productId);

    return product;
  }
}
