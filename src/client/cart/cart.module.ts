import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { ClientCartService } from './services/cart.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartProduct } from './entities/cart-product.entity';
import { CoreModule } from '@core/core.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartProduct]), CoreModule],
  controllers: [CartController],
  providers: [ClientCartService],
  exports: [ClientCartService],
})
export class CartModule {}
