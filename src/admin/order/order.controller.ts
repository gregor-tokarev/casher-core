import { Body, Controller, Param, ParseUUIDPipe, Patch } from '@nestjs/common';
import { AdminOrderService } from './services/order.service';
import { ChangeStatusDto } from './dto/change-status.dto';

@Controller('admin/order')
export class OrderController {
  constructor(private readonly adminOrderService: AdminOrderService) {}

  @Patch('/:order_id/change_status')
  async changeStatus(
    @Param('order_id', ParseUUIDPipe) orderId: string,
    @Body() changeStatusDto: ChangeStatusDto,
  ) {
    return this.adminOrderService.changeStatus(orderId, changeStatusDto);
  }
}
