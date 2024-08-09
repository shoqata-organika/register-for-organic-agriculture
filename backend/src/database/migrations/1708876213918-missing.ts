import { MigrationInterface, QueryRunner } from "typeorm";

export class Missing1708876213918 implements MigrationInterface {
    name = 'Missing1708876213918'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "processing_units" ADD "contract_start_date" date`);
        await queryRunner.query(`ALTER TABLE "processing_units" ADD "contract_end_date" date`);
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" ALTER COLUMN "planting_date" SET DEFAULT '"2023-12-31T23:00:00.000Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" ALTER COLUMN "planting_date" SET DEFAULT '2024-01-01 00:00:00+01'`);
        await queryRunner.query(`ALTER TABLE "processing_units" DROP COLUMN "contract_end_date"`);
        await queryRunner.query(`ALTER TABLE "processing_units" DROP COLUMN "contract_start_date"`);
    }

}
