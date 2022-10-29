import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { CoreModule } from '@core/core.module';

@Module({
  imports: [CoreModule],
  controllers: [ReviewController],
})
export class ReviewModule {}
