import { MigrationInterface, QueryRunner } from 'typeorm';

export class nullableProduct1685668408998 implements MigrationInterface {
  name = 'nullableProduct1685668408998';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "product"
            ALTER COLUMN "createdAt" DROP NOT NULL
    `);
    await queryRunner.query(`
        ALTER TABLE "product"
            ALTER COLUMN "updatedAt" DROP NOT NULL
    `);
    await queryRunner.query(`
        ALTER TABLE "product"
            ALTER COLUMN "title" DROP NOT NULL
    `);
    await queryRunner.query(`
        ALTER TABLE "product"
            ALTER COLUMN "price" DROP NOT NULL
    `);
    await queryRunner.query(`
        ALTER TABLE "product"
            ALTER COLUMN "priceCurrency" DROP NOT NULL
    `);
    await queryRunner.query(`
        ALTER TABLE "product"
            ALTER COLUMN "description" DROP NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "product"
            ALTER COLUMN "priceCurrency"
                SET NOT NULL
    `);
    await queryRunner.query(`
        ALTER TABLE "product"
            ALTER COLUMN "price"
                SET NOT NULL
    `);
    await queryRunner.query(`
        ALTER TABLE "product"
            ALTER COLUMN "title"
                SET NOT NULL
    `);
    await queryRunner.query(`
        ALTER TABLE "product"
            ALTER COLUMN "updatedAt"
                SET NOT NULL
    `);
    await queryRunner.query(`
        ALTER TABLE "product"
            ALTER COLUMN "createdAt"
                SET NOT NULL
    `);
    await queryRunner.query(`
        ALTER TABLE "product"
            ALTER COLUMN "description"
                SET NOT NULL
    `);
  }
}
