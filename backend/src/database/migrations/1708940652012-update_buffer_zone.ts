import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateBufferZone1708940652012 implements MigrationInterface {
    name = 'UpdateBufferZone1708940652012'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" ALTER COLUMN "planting_date" SET DEFAULT '"2023-12-31T23:00:00.000Z"'`);
        await queryRunner.query(`ALTER TABLE "land_parcels" DROP COLUMN "buffer_zone"`);
        await queryRunner.query(`ALTER TABLE "land_parcels" ADD "buffer_zone" numeric NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "land_parcels" DROP COLUMN "buffer_zone"`);
        await queryRunner.query(`ALTER TABLE "land_parcels" ADD "buffer_zone" character varying`);
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" ALTER COLUMN "planting_date" SET DEFAULT '2024-01-01 00:00:00+01'`);
    }

}
