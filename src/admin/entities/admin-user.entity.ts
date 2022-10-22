import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';

@Entity()
export class AdminUser extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  email: string;
  @Column({
    nullable: true,
  })
  password: string;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  createdAt: string;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  lastLoginAt: string;

  @Column({
    type: 'varchar',
    default: [],
    array: true,
  })
  permissions: AdminPermissions[];

  @Column({
    nullable: true,
  })
  hashedRefreshToken: string;

  @Column({
    nullable: true,
  })
  addedBy: string;

  public validatePassword(password): Promise<boolean> {
    return compare(password, this.password);
  }

  public validateRefreshToken(refreshToken: string): Promise<boolean> {
    if (!this.hashedRefreshToken) {
      throw new UnauthorizedException('User is logged out');
    }

    return compare(refreshToken, this.hashedRefreshToken);
  }
}

export enum AdminPermissions {
  CREATE_PRODUCTS = 'create_products',
  DELETE_PRODUCTS = 'delete_products',
  UPDATE_PRODUCTS = 'update_products',

  ADD_ADMIN = 'add_admin',
  ADD_PLUGINS = 'add_plugins',

  AUTH_SETTINGS = 'auth_settings',
  DB_SETTINGS = 'db_settings',
}
