import { Injectable } from '@nestjs/common';
import { Product } from '@core/entities/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateProductDto } from '../dto/update-product.dto';
import { SearchService } from '../../../search/search.service';
import { FileService } from '../../../file/file.service';
import { ProductService } from '@core/services/product.service';
import { DeletePhotosDto } from '../dto/delete-photos.dto';
import { AdminProductResponseDto } from '../dto/proeduct-response.dto';
import { plainToInstance } from 'class-transformer';
import { CategoryService } from '@core/services/category.service';

@Injectable()
export class AdminProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly searchService: SearchService,
    private readonly categoryService: CategoryService,
    private readonly fileService: FileService,
    private readonly productService: ProductService,
  ) {}

  private readonly productsIndex = 'products';

  async create(addedBy: string): Promise<Product> {
    const product = new Product();
    product.draft = true;

    const savedProduct = await product.save();

    await this.searchService.addToIndex(this.productsIndex, {
      id: product.id,
      title: '',
      description: '',
    });

    await this.productRepository
      .createQueryBuilder()
      .relation(Product, 'addedBy')
      .of(savedProduct)
      .set(addedBy);

    return savedProduct;
  }

  async generateAdminRes(
    productIds: string[],
  ): Promise<AdminProductResponseDto[]> {
    const products = await this.productRepository
      .createQueryBuilder('p')
      .select('p')
      .where('p.id in (:...ids)', { ids: productIds })
      .leftJoinAndSelect('p.reviews', 'r')
      .leftJoinAndSelect('p.cartProducts', 'cp')
      .getMany();

    return plainToInstance(
      AdminProductResponseDto,
      products.map((p) => ({
        ...p,
        reviews: undefined,
        cartProducts: undefined,
        overallRating: p.reviews.length
          ? p.reviews.reduce((acc, r) => {
              acc += r.score;
              return acc;
            }, 0) / p.reviews.length
          : -1,
        revenue: p.cartProducts.reduce((acc, cp) => {
          acc += cp.count * p.price;
          return acc;
        }, 0),
        soldCount: p.cartProducts.reduce((acc, cp) => {
          acc += cp.count;
          return acc;
        }, 0),
      })),
    );
  }

  async update(
    productId: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    await Promise.all([
      this.productRepository.update(
        { id: productId },
        {
          ...updateProductDto,
          additionalFields: JSON.parse(
            updateProductDto.additionalFields ?? '{}',
          ),
        },
      ),
      this.searchService.updateInIndex(
        this.productsIndex,
        productId,
        updateProductDto,
      ),
    ]);

    return this.productRepository.findOneBy({ id: productId });
  }

  async delete(productId: string): Promise<void> {
    await Promise.all([
      this.searchService.deleteFromIndex(this.productsIndex, productId),
      this.productRepository.delete({ id: productId }),
    ]);
  }

  async deletePhotos(
    productId: string,
    deletePhotosDto: DeletePhotosDto,
  ): Promise<Product> {
    const product = await this.productService.findByOrFail({ id: productId });
    const newPhotos = [];

    product.photos.forEach((photo) => {
      if (!deletePhotosDto.photoIds.includes(photo.id)) {
        newPhotos.push(photo);
      }
    });

    const deletePhotosPromises = deletePhotosDto.photoIds.map((photoId) =>
      this.fileService.removeFile(photoId),
    );
    await Promise.all(deletePhotosPromises);

    product.photos = newPhotos;

    return product.save();
  }

  async addPhotos(
    productId: string,
    addedBy: string,
    photos: Express.Multer.File[],
  ): Promise<Product> {
    const product = await this.productService.findByOrFail({ id: productId });
    const savedPhotos = await Promise.all(
      photos.map((photo) =>
        this.fileService.addAdminFile({ file: photo, userId: addedBy }),
      ),
    );

    await this.productRepository
      .createQueryBuilder()
      .relation(Product, 'photos')
      .of(product)
      .add(savedPhotos);

    product.photos = [...product.photos, ...savedPhotos];

    return product;
  }
}
