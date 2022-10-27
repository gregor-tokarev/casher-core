import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findById(productId: string): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id: productId });
    if (!productId) {
      throw new NotFoundException('Product Not found');
    }

    return product;
  }
}
