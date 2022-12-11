import { Module } from '@nestjs/common';
import { ClientAuthModule } from './auth/auth.module';
import { ReviewModule } from './review/review.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    ClientAuthModule,
    ReviewModule,
    CartModule,
    OrderModule,
    ProductModule,
    CategoryModule,
  ],
})
export class ClientModule {}
