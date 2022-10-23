import { Module } from '@nestjs/common';
import { AdminAuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [AdminAuthModule, ProductModule],
})
export class AdminModule {}
