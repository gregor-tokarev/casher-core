import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '@core/entities/order.entity';
import { Repository } from 'typeorm';
import { ClientCartService } from '../../cart/services/cart.service';
import { Product } from '@core/entities/product.entity';
import { CartProduct } from '../../cart/entities/cart-product.entity';
import { OrderService } from '@core/services/order.service';
import { OrderYookassaPayment } from '../entities/order-yookassa-payment.entity';
import { CreateOrderDto } from '../dto/create-order.dto';

@Injectable()
export class ClientOrderService {
  constructor(
    @InjectRepository(OrderYookassaPayment)
    private readonly orderYookassaPaymentRepository: Repository<OrderYookassaPayment>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly cartService: ClientCartService,
    private readonly orderService: OrderService,
  ) {}

  async create(
    userId,
    createOrderDto: CreateOrderDto,
  ): Promise<Order[] | Order> {
    const cart = await this.cartService.findByUser(userId);
    let products = cart.getProducts();

    const cartProductsId = products.map((product) => product.id);
    createOrderDto.products.forEach((productId) => {
      if (!cartProductsId.includes(productId)) {
        throw new BadRequestException(
          `${productId} is not exist in cart of user ${userId}`,
        );
      }
    });

    products = products.filter((product) =>
      createOrderDto.products.includes(product.id),
    );

    const currencies: Record<string, CartProduct[]> = {};
    products.forEach((product, index) => {
      if (product.priceCurrency in currencies) {
        currencies[product.priceCurrency].push(cart.cartProduct[index]);
      } else {
        currencies[product.priceCurrency] = [cart.cartProduct[index]];
      }
    });
    // TODO: add multiple payment
    if (Object.keys(currencies).length > 1) {
      throw new InternalServerErrorException(
        "Can't process order with multiple currencies",
      );
    }

    const orders = await Promise.all(
      Object.entries(currencies).map(async ([currency, products]) => {
        const order = new Order();
        order.products = products;
        order.orderCurrency = currency as Product['priceCurrency'];
        const savedOrder = await order.save();

        await this.orderRepository
          .createQueryBuilder('o')
          .relation('owner')
          .of(savedOrder)
          .set(userId);

        return savedOrder;
      }),
    );

    if (orders.length === 1) {
      return orders[0];
    }
    return orders;
  }

  async confirm(orderId: string): Promise<Order> {
    const order = await this.orderService.findOneOrFail({ id: orderId });
    order.status = 'paid';

    return order.save();
  }
}
