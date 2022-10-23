import { MigrationInterface, QueryRunner } from 'typeorm';

export class product1666512418896 implements MigrationInterface {
  name = 'product1666512418896';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "product"
        (
            "id"                uuid              NOT NULL DEFAULT uuid_generate_v4(),
            "createdAt"         TIMESTAMP         NOT NULL DEFAULT now(),
            "updatedAt"         TIMESTAMP         NOT NULL DEFAULT now(),
            "draft"             boolean           NOT NULL DEFAULT true,
            "title"             character varying NOT NULL,
            "description"       text              NOT NULL,
            "price"             integer           NOT NULL,
            "priceWithDiscount" integer,
            "priceCurrency"     character varying NOT NULL,
            "additionalFields"  json,
            "addedById"         uuid,
            "updatedById"       uuid,
            CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id")
        )
    `);
    await queryRunner.query(`
        ALTER TABLE "product"
            ADD CONSTRAINT "FK_8e3157915cf024bc6c3eb97c468" FOREIGN KEY ("addedById") REFERENCES "admin_user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
        ALTER TABLE "product"
            ADD CONSTRAINT "FK_9c29670ff9dd3fd43cf20733c19" FOREIGN KEY ("updatedById") REFERENCES "admin_user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "product"
            DROP CONSTRAINT "FK_9c29670ff9dd3fd43cf20733c19"
    `);
    await queryRunner.query(`
        ALTER TABLE "product"
            DROP CONSTRAINT "FK_8e3157915cf024bc6c3eb97c468"
    `);
    await queryRunner.query(`
        DROP TABLE "product"
    `);
  }
}
