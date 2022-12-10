import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateOrderDto {
  @IsUUID(null, { each: true })
  @IsNotEmpty()
  products: string[];
}
