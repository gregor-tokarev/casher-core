import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserOauth } from './user-oauth.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: true,
  })
  avatarUrl?: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column({
    nullable: true,
  })
  sex?: 'male' | 'female';

  @OneToOne(() => UserOauth, (userOauth) => userOauth.id, {
    cascade: true,
  })
  oauth?: UserOauth;
}
