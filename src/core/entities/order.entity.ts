import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from '@core/entities/product.entity';
import { CartProduct } from '../../client/cart/entities/cart-product.entity';
import { User } from '@core/entities/user.entity';

@Entity()
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @Column({
    default: 'created',
  })
  status: 'created' | 'paid' | 'delivery' | 'succeeded';

  @Column({
    type: 'varchar',
  })
  orderCurrency: Product['priceCurrency'];

  @JoinTable()
  @ManyToMany(() => CartProduct, (cp) => cp.id)
  products: CartProduct[];

  @JoinColumn()
  @ManyToOne(() => User, (user) => user.id)
  owner: User;

  calculatePrice(): number {
    return this.products
      ? this.products.reduce((acc, cp) => {
          acc += cp.count * cp.product.price;
          return acc;
        }, 0)
      : 0;
  }
}
