import { MigrationInterface, QueryRunner } from 'typeorm';

export class addOauthOptions1666951501791 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        insert into "client_oauth_option"(name) values ('vk'),('yandex'),('odnoklassniki')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        TRUNCATE "client_oauth_option"
    `);
  }
}
