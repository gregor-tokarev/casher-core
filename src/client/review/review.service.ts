import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from '@core/entities/review.entity';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { DeletePhotosDto } from './dto/delete-photos.dto';
import { FileService } from '../../file/file.service';
import { ReviewService } from '@core/services/review.service';

@Injectable()
export class ClientReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly fileService: FileService,
    private readonly reviewService: ReviewService,
  ) {}

  /**
   * Told, is this user already has review on this product
   * @param userId
   * @param productId
   */
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
    photos: Express.Multer.File[],
    createReviewDto: CreateReviewDto,
  ): Promise<Review> {
    const review = new Review();
    review.content = createReviewDto.content;
    review.score = createReviewDto.score;

    const savedReview = await review.save();

    const savedPhotos = await Promise.all(
      photos.map((photo) =>
        this.fileService.addAdminFile({ file: photo, userId: reviewerId }),
      ),
    );

    await Promise.all([
      this.reviewRepository
        .createQueryBuilder()
        .relation(Review, 'reviewer')
        .of(savedReview)
        .set(reviewerId),
      this.reviewRepository
        .createQueryBuilder()
        .relation(Review, 'product')
        .of(savedReview)
        .set(productId),
      this.reviewRepository
        .createQueryBuilder()
        .relation(Review, 'photos')
        .of(savedReview)
        .add(savedPhotos),
    ]);

    savedReview.photos = savedPhotos;

    return savedReview;
  }

  async update(
    reviewId: string,
    updateReviewDto: UpdateReviewDto,
  ): Promise<void> {
    await this.reviewRepository.update({ id: reviewId }, updateReviewDto);
  }

  async deletePhotos(
    reviewId: string,
    deletePhotosDto: DeletePhotosDto,
  ): Promise<Review> {
    const review = await this.reviewService.findByOrFail({ id: reviewId });
    const newPhotos = [];

    review.photos.forEach((photo) => {
      if (!deletePhotosDto.photoIds.includes(photo.id)) {
        newPhotos.push(photo);
      }
    });

    const deletePhotosPromises = deletePhotosDto.photoIds.map((photoId) =>
      this.fileService.removeFile(photoId),
    );
    await Promise.all(deletePhotosPromises);

    review.photos = newPhotos;

    return review.save();
  }

  async addPhotos(
    productId: string,
    addedBy: string,
    photos: Express.Multer.File[],
  ): Promise<Review> {
    const review = await this.reviewService.findByOrFail({ id: productId });
    const savedPhotos = await Promise.all(
      photos.map((photo) =>
        this.fileService.addClientFile({ file: photo, userId: addedBy }),
      ),
    );

    await this.reviewRepository
      .createQueryBuilder()
      .relation(Review, 'photos')
      .of(review)
      .add(savedPhotos);

    review.photos = [...review.photos, ...savedPhotos];

    return review;
  }
}
