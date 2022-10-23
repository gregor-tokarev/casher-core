import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { AdminProductService } from './services/product.service';
import { AdminAuthModule } from '../auth/auth.module';
import { CoreModule } from '../../core/core.module';

@Module({
  imports: [AdminAuthModule, CoreModule],
  controllers: [ProductController],
  providers: [AdminProductService],
})
export class ProductModule {}
