import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from '@core/services/review.service';
import { Review } from '@core/entities/review.entity';
import { AuthGuard } from '@nestjs/passport';
import { OkDto } from '@core/dto/ok.dto';

@UseGuards(AuthGuard('jwt-admin-access'))
@Controller('admin/product')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @HttpCode(HttpStatus.OK)
  @Get('/:product_id/reviews')
  async getAllProductReviews(
    @Param('product_id', ParseUUIDPipe) productId: string,
  ): Promise<Review[]> {
    const reviews = await this.reviewService.getProductReviews(productId);
    reviews.forEach((r) => r.reviewer.publicView());

    return reviews;
  }

  @HttpCode(HttpStatus.OK)
  @Delete('/review/:review_id')
  async deleteReview(
    @Param('review_id', ParseUUIDPipe) reviewId: string,
  ): Promise<OkDto> {
    await this.reviewService.delete(reviewId);

    return { message: 'ok' };
  }
}
