import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from '@core/entities/review.entity';
import { FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async findByOrFail(findOptions: FindOptionsWhere<Review>): Promise<Review> {
    const review = await this.reviewRepository.findOneBy(findOptions);
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  async getProductReviews(productId: string): Promise<Review[]> {
    return this.reviewRepository
      .createQueryBuilder('r')
      .innerJoinAndSelect('r.reviewer', 'reviewer')
      .andWhere('r.productId = :productId', { productId })
      .getMany();
  }

  async delete(reviewId: string): Promise<void> {
    await this.findByOrFail({ id: reviewId });
    await this.reviewRepository.delete({ id: reviewId });
  }
}
