import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '@core/entities/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { CategoryService } from '@core/services/category.service';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@Injectable()
export class AdminCategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly categoryService: CategoryService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = new Category();
    category.name = createCategoryDto.name;

    if (createCategoryDto.parentId) {
      const parentCategory = await this.categoryService.findOneOrFail({
        id: createCategoryDto.parentId,
      });

      category.parentId = parentCategory.id;
      category.level = parentCategory.level + 1;
    } else {
      category.parentId = null;
      category.level = 1;
    }

    return category.save();
  }

  async deleteCategory(categoryId: string): Promise<void> {
    await this.categoryRepository.delete({ id: categoryId });
  }

  async updateCategory(
    categoryId: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    if (updateCategoryDto.parentId) {
      const parentCategory = await this.categoryService.findOneOrFail({
        id: updateCategoryDto.parentId,
      });

      await this.categoryRepository.update(
        { id: categoryId },
        { ...updateCategoryDto, level: parentCategory.level + 1 },
      );
    } else {
      await this.categoryRepository.update(
        { id: categoryId },
        updateCategoryDto,
      );
    }

    return this.categoryService.findOneOrFail({ id: categoryId });
  }
}
