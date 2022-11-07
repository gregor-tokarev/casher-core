import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { ClientCartService } from './services/cart.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartProduct } from './entities/cart-product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartProduct])],
  controllers: [CartController],
  providers: [ClientCartService],
  exports: [ClientCartService],
})
export class CartModule {}
