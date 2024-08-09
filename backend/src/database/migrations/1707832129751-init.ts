import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1707832129751 implements MigrationInterface {
    name = 'Init1707832129751'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "land_parcels" RENAME COLUMN "name" TO "location"`);
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" ALTER COLUMN "from_date" SET DEFAULT '"2023-12-31T23:00:00.000Z"'`);
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" ALTER COLUMN "to_date" SET DEFAULT '"2024-12-30T23:00:00.000Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" ALTER COLUMN "to_date" SET DEFAULT '2024-12-31 00:00:00+01'`);
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" ALTER COLUMN "from_date" SET DEFAULT '2024-01-01 00:00:00+01'`);
        await queryRunner.query(`ALTER TABLE "land_parcels" RENAME COLUMN "location" TO "name"`);
    }

}
