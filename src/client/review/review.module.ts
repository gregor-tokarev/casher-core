import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { CoreModule } from '@core/core.module';
import { ClientReviewService } from './review.service';
import { FileModule } from '../../file/file.module';

@Module({
  imports: [CoreModule, FileModule],
  providers: [ClientReviewService],
  controllers: [ReviewController],
})
export class ReviewModule {}
