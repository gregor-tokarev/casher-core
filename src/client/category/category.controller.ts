import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { Category } from '@core/entities/category.entity';
import { Tree } from '../../types/tree.type';
import { CategoryService } from '@core/services/category.service';

@Controller('client/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  getTopCategories(): Promise<Category[]> {
    return this.categoryService.topCategories();
  }

  @HttpCode(HttpStatus.OK)
  @Get('/:category_id')
  async getCategoryTree(
    @Param('category_id', ParseUUIDPipe) categoryId: string,
  ): Promise<Tree<Category>> {
    await this.categoryService.findOneOrFail({ id: categoryId });

    return this.categoryService.buildTree(categoryId);
  }
}
