import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from '@core/services/category.service';
import { AdminCategoryService } from './service/category.service';
import { Category } from '@core/entities/category.entity';
import { AuthGuard } from '@nestjs/passport';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Tree } from '../../types/tree.type';
import { OkDto } from '@core/dto/ok.dto';

@UseGuards(AuthGuard('jwt-admin-access'))
@Controller('admin/category')
export class CategoryController {
  constructor(
    private readonly adminCategoryService: AdminCategoryService,
    private readonly categoryService: CategoryService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  getTopCategories(): Promise<Category[]> {
    return this.categoryService.topCategories();
  }

  @HttpCode(HttpStatus.OK)
  @Get('/all')
  getAllCategories(): Promise<Category[]> {
    return this.categoryService.allCategories();
  }

  @HttpCode(HttpStatus.OK)
  @Get('/all-tree')
  async allCategoriesTree(): Promise<Tree<Category>[]> {
    const topCategories = await this.categoryService.topCategories();

    return Promise.all(
      topCategories.map((c) => this.categoryService.buildTree(c.id)),
    );
  }

  @HttpCode(HttpStatus.OK)
  @Get('/:category_id')
  async getCategoryTree(
    @Param('category_id', ParseUUIDPipe) categoryId: string,
  ): Promise<Tree<Category>> {
    await this.categoryService.findOneOrFail({ id: categoryId });

    return this.categoryService.buildTree(categoryId);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return this.adminCategoryService.create(createCategoryDto);
  }

  @HttpCode(HttpStatus.OK)
  @Put('/:category_id')
  updateCategory(
    @Param('category_id', ParseUUIDPipe) categoryId: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.adminCategoryService.updateCategory(
      categoryId,
      updateCategoryDto,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Delete('/:category_id')
  async deleteCategory(
    @Param('category_id', ParseUUIDPipe) categoryId: string,
  ): Promise<OkDto> {
    await this.adminCategoryService.deleteCategory(categoryId);

    return { message: 'ok' };
  }
}
