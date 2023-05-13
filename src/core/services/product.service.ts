import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '@core/entities/product.entity';
import { FindOptionsWhere, In, Repository } from 'typeorm';
import { AdminSearchProductsDto } from '../../admin/product/dto/search-products.dto';
import { SearchService } from '../../search/search.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly searchService: SearchService,
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

  async searchIds(
    searchProductsDto: AdminSearchProductsDto,
  ): Promise<string[]> {
    const searchRes = await this.searchService.search(
      'products',
      searchProductsDto.q,
      ['title', 'description'],
      searchProductsDto.top,
      searchProductsDto.skip,
    );

    return searchRes.map((item) => item.id);
  }

  async search(searchProductsDto: AdminSearchProductsDto): Promise<Product[]> {
    const searchRes = await this.searchIds(searchProductsDto);

    return await this.productRepository.find({
      where: {
        id: In(searchRes),
      },
    });
  }
}
