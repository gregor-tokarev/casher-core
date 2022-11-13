import { Module } from '@nestjs/common';
import { PaymentOauthController } from './payment-oauth.controller';
import { PaymentOauthService } from './services/payment-oauth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentOption } from './entities/payment-option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentOption])],
  controllers: [PaymentOauthController],
  providers: [PaymentOauthService],
})
export class OrderModule {}
