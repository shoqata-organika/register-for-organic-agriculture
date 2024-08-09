import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1708005835159 implements MigrationInterface {
    name = 'Init1708005835159'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" ALTER COLUMN "planting_date" SET DEFAULT '"2023-12-31T23:00:00.000Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" ALTER COLUMN "planting_date" SET DEFAULT '2024-01-01 00:00:00+01'`);
    }

}
