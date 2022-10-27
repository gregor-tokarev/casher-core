import { MigrationInterface, QueryRunner } from 'typeorm';

export class clientAuth1666885573970 implements MigrationInterface {
  name = 'clientAuth1666885573970';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "user"
        (
            "id"        uuid              NOT NULL DEFAULT uuid_generate_v4(),
            "avatarUrl" character varying,
            "name"      character varying NOT NULL,
            "surname"   character varying NOT NULL,
            "sex"       character varying,
            CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
        )
    `);
    await queryRunner.query(`
        CREATE TABLE "user_oauth"
        (
            "id"           uuid              NOT NULL DEFAULT uuid_generate_v4(),
            "provider"     character varying NOT NULL,
            "email"        character varying NOT NULL,
            "refreshToken" character varying NOT NULL,
            "userId"       uuid,
            CONSTRAINT "REL_5ed0c676645727b4be0f3c27ab" UNIQUE ("userId"),
            CONSTRAINT "PK_95d512d160789656ed4f21af994" PRIMARY KEY ("id")
        )
    `);
    await queryRunner.query(`
        ALTER TABLE "user_oauth"
            ADD CONSTRAINT "FK_5ed0c676645727b4be0f3c27abf" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "user_oauth"
            DROP CONSTRAINT "FK_5ed0c676645727b4be0f3c27abf"
    `);
    await queryRunner.query(`
        DROP TABLE "user_oauth"
    `);
    await queryRunner.query(`
        DROP TABLE "user"
    `);
  }
}
