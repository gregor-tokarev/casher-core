import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    default: 1,
  })
  level: number;

  @Column({
    nullable: true,
    type: 'uuid',
    default: null,
  })
  parentId: string | null;
}
