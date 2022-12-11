import { Order } from '@core/entities/order.entity';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class ChangeStatusDto {
  @IsIn(['created', 'paid', 'delivery', 'succeeded'])
  @IsString()
  @IsNotEmpty()
  status: Order['status'];
}
