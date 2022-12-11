import { Injectable } from '@nestjs/common';
import { ChangeStatusDto } from '../dto/change-status.dto';
import { Order } from '@core/entities/order.entity';
import { OrderService } from '@core/services/order.service';

@Injectable()
export class AdminOrderService {
  constructor(private readonly orderService: OrderService) {}

  async changeStatus(
    orderId: string,
    changeStatusDto: ChangeStatusDto,
  ): Promise<Order> {
    const order = await this.orderService.findOneOrFail({ id: orderId });
    order.status = changeStatusDto.status;

    return order.save();
  }
}
