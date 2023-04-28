import { MigrationInterface, QueryRunner } from 'typeorm';

export class paymentOptions1668313108589 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        create table "payment_option"
        (
            id uuid not null primary key default uuid_generate_v4(),
            name text not null,
            enabled boolean default false,
            credentials json
        )
    `);
    await queryRunner.query(
      `insert into payment_option(name) values ('yookassa')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`drop table payment_option`);
  }
}
