import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { CoreModule } from '@core/core.module';
import { ClientReviewService } from './review.service';

@Module({
  imports: [CoreModule],
  providers: [ClientReviewService],
  controllers: [ReviewController],
})
export class ReviewModule {}
