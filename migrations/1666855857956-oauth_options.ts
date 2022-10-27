import { MigrationInterface, QueryRunner } from 'typeorm';

export class oauthOptions1666855857956 implements MigrationInterface {
  name = 'oauthOptions1666855857956';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "client_oauth_option" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "enabled" boolean NOT NULL DEFAULT false,
                "credentials" json,
                CONSTRAINT "UQ_fccc2111439d7c2f58b5588b741" UNIQUE ("name"),
                CONSTRAINT "PK_6ca56a44acca80a01705b97de35" PRIMARY KEY ("id")
            )
        `);

    await queryRunner.query(`
        INSERT INTO "client_oauth_option"(name) values ('vk'),('telegram'),('rambler'),('mailru'),('yandex')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "client_oauth_option"
        `);
  }
}
