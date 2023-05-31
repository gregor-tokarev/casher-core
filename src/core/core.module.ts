import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { OauthOption } from './entities/oauth-option.entity';
import { OauthOptionService } from './services/oauth-option.service';
import { Review } from '@core/entities/review.entity';
import { ProductService } from '@core/services/product.service';
import { ReviewService } from '@core/services/review.service';
import { PaymentOption } from '@core/entities/payment-option.entity';
import { PaymentOptionService } from '@core/services/payment-option.service';
import { OrderService } from '@core/services/order.service';
import { Order } from '@core/entities/order.entity';
import { OrderModule } from '../client/order/order.module';
import { SearchModule } from '../search/search.module';
import { Category } from '@core/entities/category.entity';
import { CategoryService } from '@core/services/category.service';
import { User } from '@core/entities/user.entity';

@Module({
  imports: [
    forwardRef(() => OrderModule),
    SearchModule,
    TypeOrmModule.forFeature([
      Product,
      Review,
      OauthOption,
      PaymentOption,
      Order,
      Category,
      User,
    ]),
  ],
  providers: [
    OauthOptionService,
    PaymentOptionService,
    ProductService,
    ReviewService,
    OrderService,
    CategoryService,
  ],
  exports: [
    TypeOrmModule,
    OauthOptionService,
    ProductService,
    ReviewService,
    PaymentOptionService,
    OrderService,
    CategoryService,
  ],
})
export class CoreModule {}
