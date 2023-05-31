import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '@core/entities/user.entity';

@Entity()
export class UserOauth extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  provider: 'yandex' | 'vk';

  @Column()
  token: string;

  @Column()
  providerId: string;

  @Column({
    unique: true,
    nullable: true,
  })
  email?: string;

  @OneToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  user: User;
}
