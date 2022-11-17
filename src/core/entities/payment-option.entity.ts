import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PaymentOption extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: 'yookassa';

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
