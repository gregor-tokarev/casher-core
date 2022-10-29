import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ReviewService } from '@core/services/review.service';

@Injectable()
export class AccessReviewGuard implements CanActivate {
  constructor(private readonly reviewService: ReviewService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user } = context.switchToHttp().getRequest();
    const { review_id: reviewId } = context.switchToHttp().getRequest().params;

    const review = await this.reviewService.findByOrFail({ id: reviewId });

    return review.reviewerId === user.sub;
  }
}
