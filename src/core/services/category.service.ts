import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '@core/entities/category.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { Tree } from '../../types/tree.type';

export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findOneOrFail(
    findOptions: FindOptionsWhere<Category>,
  ): Promise<Category> {
    const category = await this.categoryRepository.findOneBy(findOptions);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  public async buildTree(
    categoryId: string,
    depth = 999,
  ): Promise<Tree<Category>> {
    const currentNode = await this.categoryRepository.findOneBy({
      id: categoryId,
    });

    if (1 >= depth || !currentNode) {
      return {
        node: currentNode,
        children: [],
      };
    }

    const children = await this.categoryRepository.findBy({
      parentId: currentNode.id,
    });
    const childrenTrees = children.map((child) =>
      this.buildTree(child.id, depth - 1),
    );
    return {
      node: currentNode,
      children: await Promise.all(childrenTrees),
    };
  }

  public topCategories(): Promise<Category[]> {
    return this.categoryRepository.findBy({ level: 1 });
  }
}
