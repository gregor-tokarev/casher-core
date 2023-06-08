import { Injectable } from '@nestjs/common';
import { ChangeStatusDto } from '../dto/change-status.dto';
import { Order } from '@core/entities/order.entity';
import { OrderService } from '@core/services/order.service';
import { GetOrdersDto, OrdersResponseDto } from '../dto/get-orders.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AdminOrderService {
  constructor(
    private readonly orderService: OrderService,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async changeStatus(
    orderId: string,
    changeStatusDto: ChangeStatusDto,
  ): Promise<Order> {
    const order = await this.orderService.findOneOrFail({ id: orderId });
    order.status = changeStatusDto.status;

    return order.save();
  }

  async getOrders(params: GetOrdersDto): Promise<OrdersResponseDto> {
    return {
      count: await this.orderRepository.count(),
      orders: await this.orderRepository.find({
        skip: params.skip,
        take: params.take,
        relations: ['owner', 'products'],
      }),
    };
  }
}
