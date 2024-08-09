import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1707834466174 implements MigrationInterface {
    name = 'Init1707834466174'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" ALTER COLUMN "planting_date" SET DEFAULT '"2023-12-31T23:00:00.000Z"'`);
        await queryRunner.query(`ALTER TABLE "land_parcels" ALTER COLUMN "total_area" TYPE numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "land_parcels" ALTER COLUMN "utilised_area" TYPE numeric(5,2)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "land_parcels" ALTER COLUMN "utilised_area" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "land_parcels" ALTER COLUMN "total_area" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" ALTER COLUMN "planting_date" SET DEFAULT '2024-01-01 00:00:00+01'`);
    }

}
