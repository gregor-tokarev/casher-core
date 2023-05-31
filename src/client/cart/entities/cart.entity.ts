import {
  BaseEntity,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { CartProduct } from './cart-product.entity';
import { Product } from '@core/entities/product.entity';
import { User } from '@core/entities/user.entity';

@Entity()
export class Cart extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @JoinColumn()
  @OneToOne(() => User, (user) => user.id)
  owner: User;

  @RelationId((cart: Cart) => cart.owner)
  ownerId: string;

  @OneToMany(() => CartProduct, (cartProduct) => cartProduct.cart)
  cartProduct: CartProduct[];

  getProducts(): Product[] {
    return this.cartProduct.map((cp) => cp.product);
  }
}
