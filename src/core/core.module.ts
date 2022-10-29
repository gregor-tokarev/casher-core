import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { OauthOption } from './entities/oauth-option.entity';
import { OauthOptionService } from './services/oauth-option.service';
import { Review } from '@core/entities/review.entity';
import { ProductService } from '@core/services/product.service';
import { ReviewService } from '@core/services/review.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Review, OauthOption])],
  providers: [OauthOptionService, ProductService, ReviewService],
  exports: [TypeOrmModule, OauthOptionService, ProductService, ReviewService],
})
export class CoreModule {}
