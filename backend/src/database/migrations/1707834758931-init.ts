import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1707834758931 implements MigrationInterface {
    name = 'Init1707834758931'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" ALTER COLUMN "area" TYPE numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" ALTER COLUMN "planting_date" SET DEFAULT '"2023-12-31T23:00:00.000Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" ALTER COLUMN "planting_date" SET DEFAULT '2024-01-01 00:00:00+01'`);
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" DROP COLUMN "area"`);
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" ADD "area" integer NOT NULL`);
    }

}
