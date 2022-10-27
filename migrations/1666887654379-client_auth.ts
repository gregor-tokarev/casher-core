import { MigrationInterface, QueryRunner } from 'typeorm';

export class clientAuth1666887654379 implements MigrationInterface {
  name = 'clientAuth1666887654379';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user_oauth" DROP CONSTRAINT "FK_5ed0c676645727b4be0f3c27abf"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_oauth"
            ADD CONSTRAINT "UQ_bdd11013e4818e5646a5e3326bf" UNIQUE ("email")
        `);
    await queryRunner.query(`
            ALTER TABLE "user_oauth"
            ADD CONSTRAINT "FK_5ed0c676645727b4be0f3c27abf" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user_oauth" DROP CONSTRAINT "FK_5ed0c676645727b4be0f3c27abf"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_oauth" DROP CONSTRAINT "UQ_bdd11013e4818e5646a5e3326bf"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_oauth"
            ADD CONSTRAINT "FK_5ed0c676645727b4be0f3c27abf" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }
}
