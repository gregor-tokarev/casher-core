import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UnauthorizedException } from '@nestjs/common';
import { compare, hash } from 'bcrypt';

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
    type: 'uuid',
    nullable: true,
  })
  addedBy: string;

  @BeforeInsert()
  async beforeInsert() {
    this.password = this.password
      ? await hash(this.password, 10)
      : this.password;
    this.hashedRefreshToken = this.hashedRefreshToken
      ? await hash(this.hashedRefreshToken, 10)
      : this.hashedRefreshToken;
  }

  @BeforeUpdate()
  async beforeUpdate() {
    this.password = this.password
      ? await hash(this.password, 10)
      : this.password;
    this.hashedRefreshToken = this.hashedRefreshToken
      ? await hash(this.hashedRefreshToken, 10)
      : this.hashedRefreshToken;
  }

  public validatePassword(password): Promise<boolean> {
    return compare(password, this.password);
  }

  public validateRefreshToken(refreshToken: string): Promise<boolean> {
    if (!this.hashedRefreshToken) {
      throw new UnauthorizedException('Unauthorized');
    }

    return compare(refreshToken, this.hashedRefreshToken);
  }

  public publicView(): Partial<AdminUser> {
    return {
      id: this.id,
      email: this.email,
      createdAt: this.createdAt,
      lastLoginAt: this.lastLoginAt,
      permissions: this.permissions,
      addedBy: this.addedBy,
    };
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
