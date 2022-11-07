import {
  BaseEntity,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { User } from '../../entities/user.entity';
import { CartProduct } from './cart-product.entity';

@Entity()
export class Cart extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @JoinColumn()
  @OneToOne(() => User, (user) => user.id)
  owner: User;

  @RelationId((cart: Cart) => cart.owner)
  ownerId: string;

  @OneToOne(() => CartProduct, (cartProduct) => cartProduct.cart)
  cartProduct: CartProduct;
}
