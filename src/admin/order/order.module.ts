import { Module } from '@nestjs/common';
import { PaymentOauthController } from './payment-oauth.controller';
import { AdminPaymentOptionService } from './services/payment-option.service';
import { CoreModule } from '@core/core.module';
import { OrderController } from './order.controller';
import { AdminOrderService } from './services/order.service';

@Module({
  imports: [CoreModule],
  controllers: [PaymentOauthController, OrderController],
  providers: [AdminPaymentOptionService, AdminOrderService],
})
export class OrderModule {}
