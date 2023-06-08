import { IsOptional } from 'class-validator';
import { Order } from '@core/entities/order.entity';
import { Transform } from 'class-transformer';

export class GetOrdersDto {
  @Transform((v) => parseInt(v.value))
  @IsOptional()
  skip = 0;

  @Transform((v) => parseInt(v.value))
  @IsOptional()
  take = 20;
}

export class OrdersResponseDto {
  count: number;
  orders: Order[];
}
