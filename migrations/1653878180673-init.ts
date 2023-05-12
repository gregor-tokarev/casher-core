import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1653878180673 implements MigrationInterface {
  name = 'init1653878180673';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "file"
        (
            "id"           uuid              NOT NULL DEFAULT uuid_generate_v4(),
            "originalname" character varying NOT NULL,
            "path"         character varying NOT NULL,
            "mimetype"     character varying NOT NULL,
            "etag"         character varying NOT NULL,
            CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id")
        )
    `);
    await queryRunner.query(`
        CREATE TABLE "admin_user"
        (
            "id"                 uuid                     NOT NULL DEFAULT uuid_generate_v4(),
            "email"              character varying        NOT NULL,
            "password"           character varying,
            "createdAt"          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "lastLoginAt"        TIMESTAMP WITH TIME ZONE,
            "permissions"        character varying array  NOT NULL DEFAULT '{}',
            "hashedRefreshToken" character varying,
            "addedBy"            uuid,
            CONSTRAINT "UQ_840ac5cd67be99efa5cd989bf9f" UNIQUE ("email"),
            CONSTRAINT "PK_a28028ba709cd7e5053a86857b4" PRIMARY KEY ("id")
        )
    `);
    await queryRunner.query(`
        CREATE TABLE "user"
        (
            "id"                 uuid              NOT NULL DEFAULT uuid_generate_v4(),
            "avatarUrl"          character varying,
            "name"               character varying NOT NULL,
            "surname"            character varying NOT NULL,
            "sex"                character varying,
            "hashedRefreshToken" character varying,
            "oauthId"            uuid,
            CONSTRAINT "REL_b07c65387b10640a67199cc549" UNIQUE ("oauthId"),
            CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
        )
    `);
    await queryRunner.query(`
        CREATE TABLE "user_oauth"
        (
            "id"         uuid              NOT NULL DEFAULT uuid_generate_v4(),
            "provider"   character varying NOT NULL,
            "token"      character varying NOT NULL,
            "providerId" character varying NOT NULL,
            "email"      character varying,
            CONSTRAINT "UQ_bdd11013e4818e5646a5e3326bf" UNIQUE ("email"),
            CONSTRAINT "PK_95d512d160789656ed4f21af994" PRIMARY KEY ("id")
        )
    `);
    await queryRunner.query(`
        CREATE TABLE "oauth_option"
        (
            "id"          uuid              NOT NULL DEFAULT uuid_generate_v4(),
            "name"        character varying NOT NULL,
            "enabled"     boolean           NOT NULL DEFAULT false,
            "credentials" json,
            CONSTRAINT "UQ_3d0a65755fed9b4ac73d7493f35" UNIQUE ("name"),
            CONSTRAINT "PK_d5c60cfccefd825a94cb718afdd" PRIMARY KEY ("id")
        )
    `);
    await queryRunner.query(`
        CREATE TABLE "category"
        (
            "id"       uuid              NOT NULL DEFAULT uuid_generate_v4(),
            "name"     character varying NOT NULL,
            "level"    integer           NOT NULL DEFAULT '1',
            "parentId" uuid,
            CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id")
        )
    `);
    await queryRunner.query(`
        CREATE TABLE "cart"
        (
            "id"      uuid NOT NULL DEFAULT uuid_generate_v4(),
            "ownerId" uuid,
            CONSTRAINT "REL_74437c8abe0038366cda005444" UNIQUE ("ownerId"),
            CONSTRAINT "PK_c524ec48751b9b5bcfbf6e59be7" PRIMARY KEY ("id")
        )
    `);
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
            "categoryId"        uuid,
            CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id")
        )
    `);
    await queryRunner.query(`
        CREATE TABLE "cart_product"
        (
            "id"        uuid      NOT NULL DEFAULT uuid_generate_v4(),
            "count"     smallint  NOT NULL DEFAULT '0',
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
            "cartId"    uuid,
            "productId" uuid,
            CONSTRAINT "PK_dccd1ec2d6f5644a69adf163bc1" PRIMARY KEY ("id")
        )
    `);
    await queryRunner.query(`
        CREATE TABLE "order"
        (
            "id"            uuid              NOT NULL DEFAULT uuid_generate_v4(),
            "createdAt"     TIMESTAMP         NOT NULL DEFAULT now(),
            "updatedAt"     TIMESTAMP         NOT NULL DEFAULT now(),
            "status"        character varying NOT NULL DEFAULT 'created',
            "orderCurrency" character varying NOT NULL,
            "ownerId"       uuid,
            CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id")
        )
    `);
    await queryRunner.query(`
        CREATE TABLE "payment_option"
        (
            "id"          uuid              NOT NULL DEFAULT uuid_generate_v4(),
            "name"        character varying NOT NULL,
            "enabled"     boolean           NOT NULL DEFAULT false,
            "credentials" json,
            CONSTRAINT "PK_7a1b949deefa67a9a31dd1c9110" PRIMARY KEY ("id")
        )
    `);
    await queryRunner.query(`
        CREATE TABLE "review"
        (
            "id"         uuid      NOT NULL DEFAULT uuid_generate_v4(),
            "createdAt"  TIMESTAMP NOT NULL DEFAULT now(),
            "updatedAt"  TIMESTAMP NOT NULL DEFAULT now(),
            "score"      integer   NOT NULL,
            "content"    text      NOT NULL,
            "reviewerId" uuid,
            "productId"  uuid,
            CONSTRAINT "PK_2e4299a343a81574217255c00ca" PRIMARY KEY ("id")
        )
    `);
    await queryRunner.query(`
        CREATE TABLE "order_yookassa_payment"
        (
            "orderId"   uuid NOT NULL,
            "paymentId" uuid NOT NULL,
            CONSTRAINT "PK_de4639dbd2cf3374e7daae778ec" PRIMARY KEY ("orderId")
        )
    `);
    await queryRunner.query(`
        CREATE TABLE "product_photos_file"
        (
            "productId" uuid NOT NULL,
            "fileId"    uuid NOT NULL,
            CONSTRAINT "PK_67790182cc5d451aa8494ae202a" PRIMARY KEY ("productId", "fileId")
        )
    `);
    await queryRunner.query(`
        CREATE INDEX "IDX_5117530e6fa8e3c4086322bf84" ON "product_photos_file" ("productId")
    `);
    await queryRunner.query(`
        CREATE INDEX "IDX_cf8b0d97ef2b52b0749df156e2" ON "product_photos_file" ("fileId")
    `);
    await queryRunner.query(`
        CREATE TABLE "order_products_cart_product"
        (
            "orderId"       uuid NOT NULL,
            "cartProductId" uuid NOT NULL,
            CONSTRAINT "PK_02b1d98da670c5fae44e7a5b693" PRIMARY KEY ("orderId", "cartProductId")
        )
    `);
    await queryRunner.query(`
        CREATE INDEX "IDX_a7b67eb46016a946cda8fdc999" ON "order_products_cart_product" ("orderId")
    `);
    await queryRunner.query(`
        CREATE INDEX "IDX_7fc8461bba6dfe24757df054c3" ON "order_products_cart_product" ("cartProductId")
    `);
    await queryRunner.query(`
        CREATE TABLE "review_photos_file"
        (
            "reviewId" uuid NOT NULL,
            "fileId"   uuid NOT NULL,
            CONSTRAINT "PK_df8991613f18550d0e7302b9320" PRIMARY KEY ("reviewId", "fileId")
        )
    `);
    await queryRunner.query(`
        CREATE INDEX "IDX_b4e964683250a3867ff0657262" ON "review_photos_file" ("reviewId")
    `);
    await queryRunner.query(`
        CREATE INDEX "IDX_acc905c151e3c4b8789f5be9ce" ON "review_photos_file" ("fileId")
    `);
    await queryRunner.query(`
        ALTER TABLE "user"
            ADD CONSTRAINT "FK_b07c65387b10640a67199cc5490" FOREIGN KEY ("oauthId") REFERENCES "user_oauth" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
        ALTER TABLE "cart"
            ADD CONSTRAINT "FK_74437c8abe0038366cda005444d" FOREIGN KEY ("ownerId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
        ALTER TABLE "product"
            ADD CONSTRAINT "FK_8e3157915cf024bc6c3eb97c468" FOREIGN KEY ("addedById") REFERENCES "admin_user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
        ALTER TABLE "product"
            ADD CONSTRAINT "FK_9c29670ff9dd3fd43cf20733c19" FOREIGN KEY ("updatedById") REFERENCES "admin_user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
        ALTER TABLE "product"
            ADD CONSTRAINT "FK_ff0c0301a95e517153df97f6812" FOREIGN KEY ("categoryId") REFERENCES "category" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
        ALTER TABLE "cart_product"
            ADD CONSTRAINT "FK_139f8024067696fe5a8400ebda2" FOREIGN KEY ("cartId") REFERENCES "cart" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
        ALTER TABLE "cart_product"
            ADD CONSTRAINT "FK_4f1b0c66f4e0b4610e14ca42e5c" FOREIGN KEY ("productId") REFERENCES "product" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
        ALTER TABLE "order"
            ADD CONSTRAINT "FK_36eff870cbb426cbaa8f79de886" FOREIGN KEY ("ownerId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
        ALTER TABLE "review"
            ADD CONSTRAINT "FK_34413365b39e3bf5bea866569b4" FOREIGN KEY ("reviewerId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
        ALTER TABLE "review"
            ADD CONSTRAINT "FK_2a11d3c0ea1b2b5b1790f762b9a" FOREIGN KEY ("productId") REFERENCES "product" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
        ALTER TABLE "product_photos_file"
            ADD CONSTRAINT "FK_5117530e6fa8e3c4086322bf84a" FOREIGN KEY ("productId") REFERENCES "product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    `);
    await queryRunner.query(`
        ALTER TABLE "product_photos_file"
            ADD CONSTRAINT "FK_cf8b0d97ef2b52b0749df156e23" FOREIGN KEY ("fileId") REFERENCES "file" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    `);
    await queryRunner.query(`
        ALTER TABLE "order_products_cart_product"
            ADD CONSTRAINT "FK_a7b67eb46016a946cda8fdc9996" FOREIGN KEY ("orderId") REFERENCES "order" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    `);
    await queryRunner.query(`
        ALTER TABLE "order_products_cart_product"
            ADD CONSTRAINT "FK_7fc8461bba6dfe24757df054c38" FOREIGN KEY ("cartProductId") REFERENCES "cart_product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    `);
    await queryRunner.query(`
        ALTER TABLE "review_photos_file"
            ADD CONSTRAINT "FK_b4e964683250a3867ff06572628" FOREIGN KEY ("reviewId") REFERENCES "review" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    `);
    await queryRunner.query(`
        ALTER TABLE "review_photos_file"
            ADD CONSTRAINT "FK_acc905c151e3c4b8789f5be9ce1" FOREIGN KEY ("fileId") REFERENCES "file" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "review_photos_file"
            DROP CONSTRAINT "FK_acc905c151e3c4b8789f5be9ce1"
    `);
    await queryRunner.query(`
        ALTER TABLE "review_photos_file"
            DROP CONSTRAINT "FK_b4e964683250a3867ff06572628"
    `);
    await queryRunner.query(`
        ALTER TABLE "order_products_cart_product"
            DROP CONSTRAINT "FK_7fc8461bba6dfe24757df054c38"
    `);
    await queryRunner.query(`
        ALTER TABLE "order_products_cart_product"
            DROP CONSTRAINT "FK_a7b67eb46016a946cda8fdc9996"
    `);
    await queryRunner.query(`
        ALTER TABLE "product_photos_file"
            DROP CONSTRAINT "FK_cf8b0d97ef2b52b0749df156e23"
    `);
    await queryRunner.query(`
        ALTER TABLE "product_photos_file"
            DROP CONSTRAINT "FK_5117530e6fa8e3c4086322bf84a"
    `);
    await queryRunner.query(`
        ALTER TABLE "review"
            DROP CONSTRAINT "FK_2a11d3c0ea1b2b5b1790f762b9a"
    `);
    await queryRunner.query(`
        ALTER TABLE "review"
            DROP CONSTRAINT "FK_34413365b39e3bf5bea866569b4"
    `);
    await queryRunner.query(`
        ALTER TABLE "order"
            DROP CONSTRAINT "FK_36eff870cbb426cbaa8f79de886"
    `);
    await queryRunner.query(`
        ALTER TABLE "cart_product"
            DROP CONSTRAINT "FK_4f1b0c66f4e0b4610e14ca42e5c"
    `);
    await queryRunner.query(`
        ALTER TABLE "cart_product"
            DROP CONSTRAINT "FK_139f8024067696fe5a8400ebda2"
    `);
    await queryRunner.query(`
        ALTER TABLE "product"
            DROP CONSTRAINT "FK_ff0c0301a95e517153df97f6812"
    `);
    await queryRunner.query(`
        ALTER TABLE "product"
            DROP CONSTRAINT "FK_9c29670ff9dd3fd43cf20733c19"
    `);
    await queryRunner.query(`
        ALTER TABLE "product"
            DROP CONSTRAINT "FK_8e3157915cf024bc6c3eb97c468"
    `);
    await queryRunner.query(`
        ALTER TABLE "cart"
            DROP CONSTRAINT "FK_74437c8abe0038366cda005444d"
    `);
    await queryRunner.query(`
        ALTER TABLE "user"
            DROP CONSTRAINT "FK_b07c65387b10640a67199cc5490"
    `);
    await queryRunner.query(`
        DROP INDEX "public"."IDX_acc905c151e3c4b8789f5be9ce"
    `);
    await queryRunner.query(`
        DROP INDEX "public"."IDX_b4e964683250a3867ff0657262"
    `);
    await queryRunner.query(`
        DROP TABLE "review_photos_file"
    `);
    await queryRunner.query(`
        DROP INDEX "public"."IDX_7fc8461bba6dfe24757df054c3"
    `);
    await queryRunner.query(`
        DROP INDEX "public"."IDX_a7b67eb46016a946cda8fdc999"
    `);
    await queryRunner.query(`
        DROP TABLE "order_products_cart_product"
    `);
    await queryRunner.query(`
        DROP INDEX "public"."IDX_cf8b0d97ef2b52b0749df156e2"
    `);
    await queryRunner.query(`
        DROP INDEX "public"."IDX_5117530e6fa8e3c4086322bf84"
    `);
    await queryRunner.query(`
        DROP TABLE "product_photos_file"
    `);
    await queryRunner.query(`
        DROP TABLE "order_yookassa_payment"
    `);
    await queryRunner.query(`
        DROP TABLE "review"
    `);
    await queryRunner.query(`
        DROP TABLE "payment_option"
    `);
    await queryRunner.query(`
        DROP TABLE "order"
    `);
    await queryRunner.query(`
        DROP TABLE "cart_product"
    `);
    await queryRunner.query(`
        DROP TABLE "product"
    `);
    await queryRunner.query(`
        DROP TABLE "cart"
    `);
    await queryRunner.query(`
        DROP TABLE "category"
    `);
    await queryRunner.query(`
        DROP TABLE "oauth_option"
    `);
    await queryRunner.query(`
        DROP TABLE "user_oauth"
    `);
    await queryRunner.query(`
        DROP TABLE "user"
    `);
    await queryRunner.query(`
        DROP TABLE "admin_user"
    `);
    await queryRunner.query(`
        DROP TABLE "file"
    `);
  }
}
