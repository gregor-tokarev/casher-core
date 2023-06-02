import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminPermissions } from '../entities/admin-user.entity';
import { Product } from '@core/entities/product.entity';
import { Permissions } from '../auth/decorators/set-permission.decorator';
import { AdminProductService } from './services/product.service';
import { GetAdminUser } from '../auth/decorators/get-user.decorator';
import { UpdateProductDto } from './dto/update-product.dto';
import { AdminSearchProductsDto } from './dto/search-products.dto';
import { ProductService } from '@core/services/product.service';
import { ReviewService } from '@core/services/review.service';
import { Review } from '@core/entities/review.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { fileMimetypeFilter } from '../../file/utils/file-mimetype-filter';
import { DeletePhotosDto } from './dto/delete-photos.dto';
import { AdminProductResponseDto } from './dto/proeduct-response.dto';

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
  async getProducts(
    @Query() query: AdminSearchProductsDto,
  ): Promise<AdminProductResponseDto[]> {
    const products = await this.productService.searchIds(query);

    return this.adminProductService.generateAdminRes(products);
  }

  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FilesInterceptor('photos', 10, {
      fileFilter: fileMimetypeFilter('image'),
      limits: { fieldSize: 100 * 1024 },
    }),
  )
  @Permissions(AdminPermissions.CREATE_PRODUCTS)
  @Post()
  async createProduct(@GetAdminUser('sub') adminId: string): Promise<Product> {
    return this.adminProductService.create(adminId);
  }

  @HttpCode(HttpStatus.OK)
  @Permissions(AdminPermissions.UPDATE_PRODUCTS)
  @Put('/:productId')
  async updateProduct(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    await this.productService.findByOrFail({ id: productId }); // checks existence

    return this.adminProductService.update(productId, updateProductDto);
  }

  @HttpCode(HttpStatus.OK)
  @Permissions(AdminPermissions.UPDATE_PRODUCTS)
  @Patch('/:productId/delete_photos')
  async deletePhotos(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() deletePhotosDto: DeletePhotosDto,
  ): Promise<Product> {
    return this.adminProductService.deletePhotos(productId, deletePhotosDto);
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
  @Permissions(AdminPermissions.UPDATE_PRODUCTS)
  @Patch('/:productId/delete_photos')
  async deleteProductPhotos(
    @Body() deletePhotosDto: DeletePhotosDto,
    @Param('productId', ParseUUIDPipe) productId: string,
  ): Promise<Product> {
    return this.adminProductService.deletePhotos(productId, deletePhotosDto);
  }

  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FilesInterceptor('photos', 10, { fileFilter: fileMimetypeFilter('image') }),
  )
  @Permissions(AdminPermissions.UPDATE_PRODUCTS)
  @Patch('/:productId/add_photos')
  async addProductPhotos(
    @GetAdminUser('sub') adminId: string,
    @Param('productId', ParseUUIDPipe) productId: string,
    @UploadedFiles() photos: Express.Multer.File[],
  ): Promise<Product> {
    return this.adminProductService.addPhotos(productId, adminId, photos);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':product_id/reviews')
  async getReviews(
    @Param('product_id', ParseUUIDPipe) productId: string,
  ): Promise<Review[]> {
    return this.reviewService.getProductReviews(productId);
  }
}
