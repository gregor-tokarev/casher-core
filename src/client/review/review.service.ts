import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from '@core/entities/review.entity';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ClientReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async isUserReviewProduct(
    userId: string,
    productId: string,
  ): Promise<boolean> {
    const reviews = await this.reviewRepository
      .createQueryBuilder('r')
      .andWhere('r.product = :productId', { productId })
      .andWhere('r.reviewer = :userId', { userId })
      .getMany();

    return !!reviews.length;
  }

  async create(
    productId: string,
    reviewerId: string,
    createReviewDto: CreateReviewDto,
  ): Promise<Review> {
    const review = new Review();
    review.content = createReviewDto.content;
    review.score = createReviewDto.score;

    const savedReview = await review.save();

    await Promise.all([
      this.reviewRepository
        .createQueryBuilder()
        .relation('reviewer')
        .of(savedReview)
        .set(reviewerId),
      this.reviewRepository
        .createQueryBuilder()
        .relation('product')
        .of(savedReview)
        .set(productId),
    ]);

    return savedReview;
  }

  async update(
    reviewId: string,
    updateReviewDto: UpdateReviewDto,
  ): Promise<void> {
    await this.reviewRepository.update({ id: reviewId }, updateReviewDto);
  }
}
