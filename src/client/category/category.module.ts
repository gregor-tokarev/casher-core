import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CoreModule } from '@core/core.module';

@Module({
  imports: [CoreModule],
  controllers: [CategoryController],
})
export class CategoryModule {}
