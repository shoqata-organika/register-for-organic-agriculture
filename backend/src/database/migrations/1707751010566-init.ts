import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1707751010566 implements MigrationInterface {
    name = 'Init1707751010566'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cleaning_activities" ADD "cleaned_device" character varying`);
        await queryRunner.query(`ALTER TABLE "cleaning_activities" ADD "reason_of_cleaning" character varying`);
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" ALTER COLUMN "from_date" SET DEFAULT '"2023-12-31T23:00:00.000Z"'`);
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" ALTER COLUMN "to_date" SET DEFAULT '"2024-12-30T23:00:00.000Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" ALTER COLUMN "to_date" SET DEFAULT '2024-12-31 00:00:00+01'`);
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" ALTER COLUMN "from_date" SET DEFAULT '2024-01-01 00:00:00+01'`);
        await queryRunner.query(`ALTER TABLE "cleaning_activities" DROP COLUMN "reason_of_cleaning"`);
        await queryRunner.query(`ALTER TABLE "cleaning_activities" DROP COLUMN "cleaned_device"`);
    }

}
