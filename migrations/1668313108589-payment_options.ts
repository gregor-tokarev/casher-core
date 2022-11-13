import { MigrationInterface, QueryRunner } from 'typeorm';

export class paymentOptions1668313108589 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `insert into payment_option(name) values ('yookassa')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`truncate table payment_option`);
  }
}
