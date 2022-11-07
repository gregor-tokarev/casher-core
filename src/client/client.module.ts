import { Module } from '@nestjs/common';
import { ClientAuthModule } from './auth/auth.module';
import { ReviewModule } from './review/review.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [ClientAuthModule, ReviewModule, CartModule],
})
export class ClientModule {}
