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
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../client/entities/user.entity';
import { Product } from '@core/entities/product.entity';
import { File } from '../../file/file.entity';

@Entity()
export class Review extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @Column()
  score: number;

  @Column({
    type: 'text',
  })
  content: string;

  @JoinColumn()
  @ManyToOne(() => User, (user) => user.id)
  reviewer: User;

  @RelationId((review: Review) => review.reviewer)
  reviewerId: string;

  @JoinColumn()
  @ManyToOne(() => Product, (product) => product.id)
  product: Product;

  @JoinTable()
  @ManyToMany(() => File, (file) => file.id)
  photos: File[];
}
