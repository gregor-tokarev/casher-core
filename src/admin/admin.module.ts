import { Module } from '@nestjs/common';
import { AdminAuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { AdminUsersModule } from './users/users.module';

@Module({
  imports: [AdminAuthModule, ProductModule, AdminUsersModule],
})
export class AdminModule {}
