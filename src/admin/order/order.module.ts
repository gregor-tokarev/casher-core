import { Module } from '@nestjs/common';
import { PaymentOauthController } from './payment-oauth.controller';
import { AdminPaymentOptionService } from './services/payment-option.service';
import { CoreModule } from '@core/core.module';

@Module({
  imports: [CoreModule],
  controllers: [PaymentOauthController],
  providers: [AdminPaymentOptionService],
})
export class OrderModule {}
