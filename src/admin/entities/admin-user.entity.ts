import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class AdminUser extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  email: string;
  @Column()
  password: string;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  created_at: string;

  @Column({
    type: 'timestamptz',
  })
  last_login_at: string;

  @Column({
    type: 'varchar',
    default: [],
    array: true,
  })
  permissions: string[];

  @Column({
    nullable: true,
  })
  hashed_refresh_token: string;

  @Column({
    nullable: true,
  })
  added_by: string;
}
