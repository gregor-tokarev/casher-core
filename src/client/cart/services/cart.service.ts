import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, In, Repository } from 'typeorm';
import { Cart } from '../entities/cart.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ManageProductsDto } from '../dto/manage-products.dto';
import { CartProduct } from '../entities/cart-product.entity';
import { SetCountDto } from '../dto/set-count.dto';
import { OrderService } from '@core/services/order.service';

@Injectable()
export class ClientCartService {
  constructor(
    private readonly orderService: OrderService,
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

  async clear(userId: string, orderId: string): Promise<Cart> {
    const cart = await this.findByUser(userId);
    const order = await this.orderService.findOneOrFail({ id: orderId });

    const orderProductsIds = order.products.map((cp) => cp.product.id);
    cart.cartProduct = cart.cartProduct.filter(
      (cp) => !orderProductsIds.includes(cp.product.id),
    );

    return cart.save();
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

  async findByUser(userId: string): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      relations: ['owner', 'cartProduct.product'],
      where: {
        owner: {
          id: userId,
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
    const cartProductsIds = cart.cartProduct.map((cp) => cp.product.id);

    const relations = manageProductsDto.products.map(async (productId) => {
      if (cartProductsIds.includes(productId)) {
        const relation = cart.cartProduct.find(
          (cp) => cp.product.id === productId,
        );
        relation.count += 1;

        return relation.save();
      } else {
        const relation = new CartProduct();
        relation.cart = cart;
        relation.count = 1;
        const savedRelation = await relation.save();

        return this.cartProductRepository
          .createQueryBuilder()
          .relation('product')
          .of(savedRelation)
          .set(productId);
      }
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
