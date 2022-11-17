import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '@core/entities/order.entity';
import { FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async findOneOrFail(findOptions: FindOptionsWhere<Order>): Promise<Order> {
    const order = this.orderRepository.findOne({
      where: findOptions,
      relations: ['products', 'products.product', 'owner'],
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }
}
