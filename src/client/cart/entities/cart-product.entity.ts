import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from '@core/entities/product.entity';

@Entity()
export class CartProduct extends BaseEntity {
  @JoinColumn()
  @OneToOne(() => Cart, (cart) => cart.id)
  cart: Cart;

  @PrimaryColumn({
    primary: false,
    type: 'smallint',
    default: 0,
  })
  count: number;

  @JoinColumn()
  @OneToOne(() => Product, (product) => product.id)
  product: Product;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
