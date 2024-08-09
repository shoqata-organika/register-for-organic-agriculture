import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1707907113394 implements MigrationInterface {
    name = 'Init1707907113394'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."sales_product_type_enum" AS ENUM('processed', 'not processed')`);
        await queryRunner.query(`ALTER TABLE "sales" ADD "product_type" "public"."sales_product_type_enum"`);
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" ALTER COLUMN "planting_date" SET DEFAULT '"2023-12-31T23:00:00.000Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" ALTER COLUMN "planting_date" SET DEFAULT '2024-01-01 00:00:00+01'`);
        await queryRunner.query(`ALTER TABLE "sales" DROP COLUMN "product_type"`);
        await queryRunner.query(`DROP TYPE "public"."sales_product_type_enum"`);
    }

}
