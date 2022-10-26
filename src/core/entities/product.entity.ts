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
import { AdminUser } from '../../admin/entities/admin-user.entity';

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

  @JoinColumn()
  @ManyToOne(() => AdminUser, (adminUser) => adminUser.id)
  addedBy: AdminUser;

  @JoinColumn()
  @ManyToOne(() => AdminUser, (adminUser) => adminUser.id)
  updatedBy: AdminUser;

  @Column()
  price: number;

  @Column({
    nullable: true,
  })
  priceWithDiscount?: number;

  @Column()
  priceCurrency: 'ruble' | 'dollar';

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
