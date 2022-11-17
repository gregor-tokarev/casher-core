import { Module } from '@nestjs/common';
import { ClientAuthModule } from './auth/auth.module';
import { ReviewModule } from './review/review.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [ClientAuthModule, ReviewModule, CartModule, OrderModule],
})
export class ClientModule {}
