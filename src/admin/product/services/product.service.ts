import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { Product } from '../../../core/entities/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateProductDto } from '../dto/update-product.dto';
import { productNotFound } from '../errors';

@Injectable()
export class AdminProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

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

    return savedProduct;
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
    await this.productRepository.update(
      { id: productId },
      {
        ...updateProductDto,
        additionalFields: JSON.parse(updateProductDto.additionalFields),
      },
    );

    return this.productRepository.findOneBy({ id: productId });
  }
}
