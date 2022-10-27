import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserOauth extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  provider: 'yandex' | 'rambler' | 'mailru' | 'vk';

  @Column()
  refreshToken: string;

  @Column({
    unique: true,
  })
  email: string;

  @JoinColumn()
  @OneToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  user: User;
}
