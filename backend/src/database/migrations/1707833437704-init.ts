import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1707833437704 implements MigrationInterface {
    name = 'Init1707833437704'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" DROP COLUMN "from_date"`);
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" DROP COLUMN "to_date"`);
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" ADD "planting_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT '"2023-12-31T23:00:00.000Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" DROP COLUMN "planting_date"`);
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" ADD "to_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT '2024-12-31 00:00:00+01'`);
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" ADD "from_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT '2024-01-01 00:00:00+01'`);
    }

}
