import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ReviewService } from '@core/services/review.service';
import { Review } from '@core/entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetClientUser } from '../auth/decorators/get-user.decorator';
import { ClientReviewService } from './review.service';
import { AccessReviewGuard } from './guards/access-review.guard';
import { UpdateReviewDto } from './dto/update-review.dto';
import { OkDto } from '@core/dto/ok.dto';
import { DeletePhotosDto } from './dto/delete-photos.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { fileMimetypeFilter } from '../../file/utils/file-mimetype-filter';

@Controller('client/product')
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly clientReviewService: ClientReviewService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get('/:product_id/reviews')
  async getReviews(
    @Param('product_id', ParseUUIDPipe) productId: string,
  ): Promise<Review[]> {
    const reviews = await this.reviewService.getProductReviews(productId);
    reviews.forEach((r) => r.reviewer.publicView());

    return reviews;
  }

  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FilesInterceptor('photos', 10, { fileFilter: fileMimetypeFilter('image') }),
  )
  @UseGuards(AuthGuard('jwt-client-access'))
  @Post('/:product_id/review')
  async createReview(
    @Param('product_id', ParseUUIDPipe) productId: string,
    @GetClientUser('sub') userId: string,
    @Body() createReviewDto: CreateReviewDto,
    @UploadedFiles() photos: Express.Multer.File[],
  ): Promise<Review> {
    const alreadyReviewed = await this.clientReviewService.isUserReviewProduct(
      userId,
      productId,
    );
    if (alreadyReviewed) {
      throw new ForbiddenException('User already reviewed this product');
    }

    return this.clientReviewService.create(
      productId,
      userId,
      photos,
      createReviewDto,
    );
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessReviewGuard)
  @UseGuards(AuthGuard('jwt-client-access'))
  @Put('/review/:review_id')
  async updateReview(
    @Param('review_id', ParseUUIDPipe) reviewId: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ): Promise<Review> {
    await this.clientReviewService.update(reviewId, updateReviewDto);

    return this.reviewService.findByOrFail({ id: reviewId });
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessReviewGuard)
  @UseGuards(AuthGuard('jwt-client-access'))
  @Patch('/review/:review_id/delete_photos')
  async deletePhotos(
    @Param('review_id', ParseUUIDPipe) reviewId: string,
    @Body() deletePhotosDto: DeletePhotosDto,
  ): Promise<Review> {
    return this.clientReviewService.deletePhotos(reviewId, deletePhotosDto);
  }

  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FilesInterceptor('photos', 10, { fileFilter: fileMimetypeFilter('image') }),
  )
  @UseGuards(AccessReviewGuard)
  @UseGuards(AuthGuard('jwt-client-access'))
  @Patch('/review/:review_id/add_photos')
  async addPhotos(
    @GetClientUser('sub') userId: string,
    @Param('review_id', ParseUUIDPipe) reviewId: string,
    @UploadedFiles() photos: Express.Multer.File[],
  ): Promise<Review> {
    return this.clientReviewService.addPhotos(reviewId, userId, photos);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessReviewGuard)
  @UseGuards(AuthGuard('jwt-client-access'))
  @Delete('/review/:review_id')
  async deleteReview(
    @Param('review_id', ParseUUIDPipe) reviewId: string,
  ): Promise<OkDto> {
    await this.reviewService.delete(reviewId);

    return { message: 'ok' };
  }
}
