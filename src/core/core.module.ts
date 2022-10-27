import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ClientOauthOption } from './entities/oauth-option.entity';
import { ProductService } from './services/product.service';
import { OauthOptionService } from './services/oauth-option.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ClientOauthOption])],
  providers: [ProductService, OauthOptionService],
  exports: [TypeOrmModule, ProductService, OauthOptionService],
})
export class CoreModule {}
