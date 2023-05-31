import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { compare, hash } from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { UserOauth } from '../../client/entities/user-oauth.entity';
import { Order } from '@core/entities/order.entity';

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

  @CreateDateColumn()
  createdAt: string;

  @Column({
    nullable: true,
  })
  sex?: 'male' | 'female';

  @Column({
    nullable: true,
  })
  hashedRefreshToken: string;

  @JoinColumn()
  @OneToOne(() => UserOauth, (userOauth) => userOauth.id, {
    cascade: true,
  })
  oauth?: UserOauth;

  @OneToMany(() => Order, (order) => order.owner)
  order: Order;

  @BeforeInsert()
  async beforeInsert() {
    this.hashedRefreshToken = this.hashedRefreshToken
      ? await hash(this.hashedRefreshToken, 10)
      : this.hashedRefreshToken;
  }

  @BeforeUpdate()
  async beforeUpdate() {
    this.hashedRefreshToken = this.hashedRefreshToken
      ? await hash(this.hashedRefreshToken, 10)
      : this.hashedRefreshToken;
  }

  public publicView(): void {
    delete this.hashedRefreshToken;
  }

  public validateRefreshToken(refreshToken: string): Promise<boolean> {
    if (!this.hashedRefreshToken) {
      throw new UnauthorizedException('Unauthorized');
    }

    return compare(refreshToken, this.hashedRefreshToken);
  }
}
