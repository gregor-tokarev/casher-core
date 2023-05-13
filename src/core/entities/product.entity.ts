import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AdminUser } from '../../admin/entities/admin-user.entity';
import { File } from '../../file/file.entity';
import { Category } from '@core/entities/category.entity';
import { Review } from '@core/entities/review.entity';
import { CartProduct } from '../../client/cart/entities/cart-product.entity';

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @Column({
    default: true,
  })
  draft: boolean;

  @Column()
  title: string;

  @Column({
    type: 'text',
  })
  description: string;

  @JoinTable()
  @ManyToMany(() => File, (file) => file.id)
  photos: File[];

  @JoinColumn()
  @ManyToOne(() => AdminUser, (adminUser) => adminUser.id)
  addedBy: AdminUser;

  @JoinColumn()
  @ManyToOne(() => AdminUser, (adminUser) => adminUser.id)
  updatedBy: AdminUser;

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  @OneToMany(() => CartProduct, (cartProduct) => cartProduct.product)
  cartProducts: CartProduct[];

  @Column()
  price: number;

  @Column({
    nullable: true,
  })
  priceWithDiscount?: number;

  @Column()
  priceCurrency: 'ruble' | 'dollar';

  @JoinColumn()
  @ManyToOne(() => Category, (category) => category.id)
  category: Category;

  @Column({
    type: 'json',
    nullable: true,
  })
  additionalFields: Record<string, any>;
}

export class ProductSearchItem {
  id: string;
  title: string;
  description: string;
}
