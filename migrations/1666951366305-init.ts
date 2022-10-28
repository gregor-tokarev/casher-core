import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1666951366305 implements MigrationInterface {
  name = 'init1666951366305';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "admin_user" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "email" character varying NOT NULL,
                "password" character varying,
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "lastLoginAt" TIMESTAMP WITH TIME ZONE,
                "permissions" character varying array NOT NULL DEFAULT '{}',
                "hashedRefreshToken" character varying,
                "addedBy" uuid,
                CONSTRAINT "UQ_840ac5cd67be99efa5cd989bf9f" UNIQUE ("email"),
                CONSTRAINT "PK_a28028ba709cd7e5053a86857b4" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "product" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "draft" boolean NOT NULL DEFAULT true,
                "title" character varying NOT NULL,
                "description" text NOT NULL,
                "price" integer NOT NULL,
                "priceWithDiscount" integer,
                "priceCurrency" character varying NOT NULL,
                "additionalFields" json,
                "addedById" uuid,
                "updatedById" uuid,
                CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "user" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "avatarUrl" character varying,
                "name" character varying NOT NULL,
                "surname" character varying NOT NULL,
                "sex" character varying,
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "user_oauth" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "provider" character varying NOT NULL,
                "token" character varying NOT NULL,
                "providerId" character varying NOT NULL,
                "email" character varying,
                "userId" uuid,
                CONSTRAINT "UQ_bdd11013e4818e5646a5e3326bf" UNIQUE ("email"),
                CONSTRAINT "REL_5ed0c676645727b4be0f3c27ab" UNIQUE ("userId"),
                CONSTRAINT "PK_95d512d160789656ed4f21af994" PRIMARY KEY ("id")
            )
        `);
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
            ALTER TABLE "product"
            ADD CONSTRAINT "FK_8e3157915cf024bc6c3eb97c468" FOREIGN KEY ("addedById") REFERENCES "admin_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "product"
            ADD CONSTRAINT "FK_9c29670ff9dd3fd43cf20733c19" FOREIGN KEY ("updatedById") REFERENCES "admin_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
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
            ALTER TABLE "product" DROP CONSTRAINT "FK_9c29670ff9dd3fd43cf20733c19"
        `);
    await queryRunner.query(`
            ALTER TABLE "product" DROP CONSTRAINT "FK_8e3157915cf024bc6c3eb97c468"
        `);
    await queryRunner.query(`
            DROP TABLE "client_oauth_option"
        `);
    await queryRunner.query(`
            DROP TABLE "user_oauth"
        `);
    await queryRunner.query(`
            DROP TABLE "user"
        `);
    await queryRunner.query(`
            DROP TABLE "product"
        `);
    await queryRunner.query(`
            DROP TABLE "admin_user"
        `);
  }
}
