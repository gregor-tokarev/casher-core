import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminOrderService } from './services/order.service';
import { ChangeStatusDto } from './dto/change-status.dto';
import { GetOrdersDto } from './dto/get-orders.dto';
import { Order } from '@core/entities/order.entity';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt-admin-access'))
@Controller('admin/order')
export class OrderController {
  constructor(private readonly adminOrderService: AdminOrderService) {}

  @HttpCode(HttpStatus.OK)
  @Patch('/:order_id/change_status')
  async changeStatus(
    @Param('order_id', ParseUUIDPipe) orderId: string,
    @Body() changeStatusDto: ChangeStatusDto,
  ) {
    return this.adminOrderService.changeStatus(orderId, changeStatusDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async getAllOrders(@Query() q: GetOrdersDto): Promise<Order[]> {
    return this.adminOrderService.getOrders(q);
  }
}
