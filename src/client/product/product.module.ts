import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { CoreModule } from '@core/core.module';

@Module({
  imports: [CoreModule],
  controllers: [ProductController],
})
export class ProductModule {}
