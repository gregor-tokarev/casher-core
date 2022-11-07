import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Cart } from '../entities/cart.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ManageProductsDto } from '../dto/manage-products.dto';
import { CartProduct } from '../entities/cart-product.entity';

@Injectable()
export class ClientCartService {
  constructor(
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartProduct)
    private readonly cartProductRepository: Repository<CartProduct>,
  ) {}

  async create(ownerId: string): Promise<Cart> {
    const cart = new Cart();
    const savedCart = await cart.save();

    await this.cartRepository
      .createQueryBuilder('c')
      .relation('owner')
      .of(savedCart)
      .set(ownerId);

    return savedCart;
  }

  async findOneOrFail(findOptions: FindOptionsWhere<Cart>) {
    const cart = await this.cartRepository.findOne({
      where: findOptions,
      relations: {
        cartProduct: {
          product: true,
        },
      },
    });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    return cart;
  }

  async addProducts(
    cartId: string,
    manageProductsDto: ManageProductsDto,
  ): Promise<void> {
    const cart = await this.findOneOrFail({ id: cartId });
    const relations = manageProductsDto.products.map(async (productId) => {
      const relation = new CartProduct();
      relation.cart = cart;
      relation.count = 1;
      await relation.save();

      return this.cartProductRepository
        .createQueryBuilder()
        .relation('product')
        .of(relation)
        .set(productId);
    });

    await Promise.all(relations);
  }

  async removeProducts(
    cartId: string,
    manageProductsDto: ManageProductsDto,
  ): Promise<void> {
    const cart = await this.findOneOrFail({ id: cartId });
    await this.cartRepository
      .createQueryBuilder()
      .relation('products')
      .of(cart.id)
      .remove(manageProductsDto.products);
  }
}
