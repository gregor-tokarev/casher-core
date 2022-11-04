import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '@core/entities/product.entity';
import { FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findByOrFail(findOptions: FindOptionsWhere<Product>): Promise<Product> {
    const product = this.productRepository.findOne({
      where: findOptions,
      relations: ['photos'],
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }
}
