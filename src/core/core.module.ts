import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { OauthOption } from './entities/oauth-option.entity';
import { OauthOptionService } from './services/oauth-option.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, OauthOption])],
  providers: [OauthOptionService],
  exports: [TypeOrmModule, OauthOptionService],
})
export class CoreModule {}
