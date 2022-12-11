import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CoreModule } from '@core/core.module';
import { AdminCategoryService } from './service/category.service';

@Module({
  imports: [CoreModule],
  providers: [AdminCategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
