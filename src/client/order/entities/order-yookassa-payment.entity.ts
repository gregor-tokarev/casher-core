import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class OrderYookassaPayment extends BaseEntity {
  @PrimaryColumn({
    type: 'uuid',
  })
  orderId: string;

  @Column({
    type: 'uuid',
  })
  paymentId: string;
}
