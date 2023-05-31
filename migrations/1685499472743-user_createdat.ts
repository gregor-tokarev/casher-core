import { MigrationInterface, QueryRunner } from 'typeorm';

export class userCreatedat1685499472743 implements MigrationInterface {
  name = 'userCreatedat1685499472743';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "user"
            ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "user"
            DROP COLUMN "createdAt"
    `);
  }
}
