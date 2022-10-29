import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class OauthOption extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  name: string;

  @Column({
    default: false,
  })
  enabled: boolean;

  @Column({
    type: 'json',
    nullable: true,
  })
  credentials?: Record<string, string>;
}
