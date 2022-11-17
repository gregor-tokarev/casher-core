import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { CoreModule } from '@core/core.module';
import { YookassaService } from './services/yookassa.service';
import { ClientOrderService } from './services/order.service';
import { CartModule } from '../cart/cart.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderYookassaPayment } from './entities/order-yookassa-payment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderYookassaPayment]),
    CoreModule,
    CartModule,
  ],
  providers: [YookassaService, ClientOrderService],
  controllers: [OrderController],
})
export class OrderModule {}
