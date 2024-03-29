import { Injectable } from '@nestjs/common';
import { Product } from '@core/entities/product.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateProductDto } from '../dto/update-product.dto';
import { SearchService } from '../../../search/search.service';
import { FileService } from '../../../file/file.service';
import { ProductService } from '@core/services/product.service';
import { DeletePhotosDto } from '../dto/delete-photos.dto';
import { AdminProductResponseDto } from '../dto/proeduct-response.dto';
import { plainToInstance } from 'class-transformer';
import { CategoryService } from '@core/services/category.service';
import { AdminSearchProductsDto } from '../dto/search-products.dto';

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
    query: AdminSearchProductsDto,
  ): Promise<AdminProductResponseDto> {
    let productsQuery = this.productRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.reviews', 'r')
      .leftJoinAndSelect('p.cartProducts', 'cp')
      .leftJoinAndSelect('p.photos', 'ph')
      .leftJoinAndSelect('p.category', 'c')
      .orderBy('p.updatedAt');

    productsQuery = this.addFiltersOnQuery(productsQuery, query);

    if (productIds.length) {
      productsQuery = productsQuery.where('p.id in (:...ids)', {
        ids: productIds,
      });
    }
    productsQuery = productsQuery.skip(query.skip).take(query.top);

    const products = await productsQuery.getMany();

    const processedProducts = products.map((p) => ({
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
    }));

    return plainToInstance(AdminProductResponseDto, {
      count: await this.count(query, productIds),
      products: processedProducts,
    });
  }

  private addFiltersOnQuery(
    query: SelectQueryBuilder<Product>,
    q: AdminSearchProductsDto,
  ) {
    if (q.categories && q.categories.length) {
      query = query.where('p.category in (:...ids)', {
        ids: q.categories,
      });
    }

    return query;
  }

  async count(
    q: AdminSearchProductsDto,
    productIds: string[],
  ): Promise<number> {
    let query = this.productRepository.createQueryBuilder('p');
    query = this.addFiltersOnQuery(query, q);

    if (productIds.length) {
      query = query.where('p.id in (:...ids)', {
        ids: productIds,
      });
    }

    return query.getCount();
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
