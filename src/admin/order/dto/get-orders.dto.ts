import { IsNumber, IsOptional } from 'class-validator';
import { Order } from '@core/entities/order.entity';

export class GetOrdersDto {
  @IsNumber()
  @IsOptional()
  skip = 0;

  @IsNumber()
  @IsOptional()
  take = 20;
}

export class OrdersResponseDto {
  count: number;
  orders: Order[];
}
