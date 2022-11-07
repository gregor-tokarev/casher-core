import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from '@core/entities/product.entity';

@Entity()
export class CartProduct extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @JoinColumn()
  @ManyToOne(() => Cart, (cart) => cart.id)
  cart: Cart;

  @Column({
    primary: false,
    type: 'smallint',
    default: 0,
  })
  count: number;

  @JoinColumn()
  @ManyToOne(() => Product, (product) => product.id)
  product: Product;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
