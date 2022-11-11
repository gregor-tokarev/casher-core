import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, In, Repository } from 'typeorm';
import { Cart } from '../entities/cart.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ManageProductsDto } from '../dto/manage-products.dto';
import { CartProduct } from '../entities/cart-product.entity';
import { SetCountDto } from '../dto/set-count.dto';

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
      relations: ['cartProduct.product'],
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
      const savedRelation = await relation.save();

      return this.cartProductRepository
        .createQueryBuilder()
        .relation('product')
        .of(savedRelation)
        .set(productId);
    });

    await Promise.all(relations);
  }

  async removeProducts(
    cartId: string,
    manageProductsDto: ManageProductsDto,
  ): Promise<void> {
    await this.findOneOrFail({ id: cartId });

    const relations = await this.cartProductRepository.find({
      where: { product: In(manageProductsDto.products) },
    });
    await Promise.all(relations.map((r) => r.remove()));
  }

  async getRelationByProductId(productId: string): Promise<CartProduct> {
    const relation = await this.cartProductRepository
      .createQueryBuilder('cp')
      .andWhere('cp.product = :productId', { productId })
      .getOne();
    if (!relation) {
      throw new NotFoundException('Product not found');
    }

    return relation;
  }

  async setProductCount(
    productId: string,
    { count }: SetCountDto,
  ): Promise<CartProduct> {
    const relation = await this.getRelationByProductId(productId);

    relation.count = count;

    return relation.save();
  }
}