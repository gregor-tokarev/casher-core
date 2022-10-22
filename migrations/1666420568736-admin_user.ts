import { MigrationInterface, QueryRunner } from 'typeorm';

export class adminUser1666420568736 implements MigrationInterface {
  name = 'adminUser1666420568736';

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
                "addedBy" character varying,
                CONSTRAINT "UQ_840ac5cd67be99efa5cd989bf9f" UNIQUE ("email"),
                CONSTRAINT "PK_a28028ba709cd7e5053a86857b4" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "admin_user"
        `);
  }
}
