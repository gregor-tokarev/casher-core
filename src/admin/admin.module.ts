import { Module } from '@nestjs/common';
import { AdminAuthModule } from './auth/auth.module';
import { AdminProductModule } from './product/product.module';
import { AdminUsersModule } from './users/users.module';
import { ReviewModule } from './review/review.module';
import { OrderModule } from './order/order.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    AdminAuthModule,
    AdminProductModule,
    AdminUsersModule,
    ReviewModule,
    OrderModule,
    CategoryModule,
  ],
})
export class AdminModule {}
