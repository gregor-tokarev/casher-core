import { Injectable } from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { Product } from '@core/entities/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateProductDto } from '../dto/update-product.dto';
import { SearchService } from '../../../search/search.service';
import { FileService } from '../../../file/file.service';
import { ProductService } from '@core/services/product.service';
import { DeletePhotosDto } from '../dto/delete-photos.dto';

@Injectable()
export class AdminProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly searchService: SearchService,
    private readonly fileService: FileService,
    private readonly productService: ProductService,
  ) {}

  private readonly productsIndex = 'products';

  async create(
    addedBy: string,
    photos: Express.Multer.File[],
    createProductDto: CreateProductDto,
  ): Promise<Product> {
    const product = new Product();
    product.title = createProductDto.title;
    product.description = createProductDto.description;
    product.price = createProductDto.price;
    product.priceWithDiscount = createProductDto.priceWithDiscount;
    product.priceCurrency = createProductDto.priceCurrency;
    product.additionalFields = createProductDto.additionalFields
      ? JSON.parse(createProductDto.additionalFields)
      : {};

    const savedProduct = await product.save();

    const savedPhotos = await Promise.all(
      photos.map((photo) =>
        this.fileService.addAdminFile({ file: photo, userId: addedBy }),
      ),
    );

    await Promise.all([
      this.productRepository
        .createQueryBuilder()
        .relation(Product, 'addedBy')
        .of(savedProduct)
        .set(addedBy),
      this.productRepository
        .createQueryBuilder()
        .relation(Product, 'updatedBy')
        .of(savedProduct)
        .set(addedBy),
      this.productRepository
        .createQueryBuilder()
        .relation(Product, 'photos')
        .of(savedProduct)
        .add(savedPhotos),
    ]);

    await this.searchService.addToIndex(this.productsIndex, {
      id: product.id,
      title: product.title,
      description: product.description,
      ...product.additionalFields,
    });

    savedProduct.photos = savedPhotos;

    return savedProduct;
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
          additionalFields: JSON.parse(updateProductDto.additionalFields),
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
