import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserOauth } from './user-oauth.entity';
import { compare, hash } from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

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

  @Column({
    nullable: true,
  })
  hashedRefreshToken: string;

  @JoinColumn()
  @OneToOne(() => UserOauth, (userOauth) => userOauth.id, {
    cascade: true,
  })
  oauth?: UserOauth;

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

  public validateRefreshToken(refreshToken: string): Promise<boolean> {
    if (!this.hashedRefreshToken) {
      throw new UnauthorizedException('Unauthorized');
    }

    return compare(refreshToken, this.hashedRefreshToken);
  }
}
