import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { Product } from '../../../core/entities/product.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateProductDto } from '../dto/update-product.dto';
import { productNotFound } from '../errors';
import { SearchService } from '../../../search/search.service';
import { SearchProductsDto } from '../dto/search-products.dto';

@Injectable()
export class AdminProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly searchService: SearchService,
  ) {}

  private readonly productsIndex = 'products';

  async create(
    addedBy: string,
    createProductDto: CreateProductDto,
  ): Promise<Product> {
    const product = new Product();
    product.title = createProductDto.title;
    product.description = createProductDto.description;
    product.price = createProductDto.price;
    product.priceWithDiscount = createProductDto.priceWithDiscount;
    product.priceCurrency = createProductDto.priceCurrency;
    product.additionalFields = JSON.parse(createProductDto.additionalFields);

    const savedProduct = await product.save();

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
    ]);

    await this.searchService.addToIndex(this.productsIndex, {
      id: product.id,
      title: product.title,
      description: product.description,
      ...product.additionalFields,
    });

    return savedProduct;
  }

  async search(searchProductsDto: SearchProductsDto): Promise<Product[]> {
    const searchRes = await this.searchService.search(
      'products',
      searchProductsDto.q,
      ['title', 'description'],
      searchProductsDto.top,
      searchProductsDto.skip,
    );

    return await this.productRepository.findBy({
      id: In(searchRes.map((item) => item.id)),
    });
  }

  async findById(productId: string): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id: productId });
    if (!productId) {
      throw new NotFoundException(productNotFound);
    }

    return product;
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
}
