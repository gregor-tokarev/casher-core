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

  @CreateDateColumn({ nullable: true })
  createdAt: string;

  @UpdateDateColumn({ nullable: true })
  updatedAt: string;

  @Column({
    default: true,
  })
  draft: boolean;

  @Column({ nullable: true })
  title: string;

  @Column({
    type: 'text',
    nullable: true,
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

  @Column({ nullable: true })
  price: number;

  @Column({
    nullable: true,
  })
  priceWithDiscount?: number;

  @Column({ nullable: true })
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
