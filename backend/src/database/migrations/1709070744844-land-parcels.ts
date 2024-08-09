import { MigrationInterface, QueryRunner } from "typeorm";

export class LandParcels1709070744844 implements MigrationInterface {
    name = 'LandParcels1709070744844'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" ADD "sub_parcel_id" integer`);
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" ALTER COLUMN "planting_date" SET DEFAULT '"2023-12-31T23:00:00.000Z"'`);
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" ADD CONSTRAINT "FK_0c38289c417daa7adb4af2187b9" FOREIGN KEY ("sub_parcel_id") REFERENCES "subparcels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" DROP CONSTRAINT "FK_0c38289c417daa7adb4af2187b9"`);
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" ALTER COLUMN "planting_date" SET DEFAULT '2023-12-31'`);
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" DROP COLUMN "sub_parcel_id"`);
    }

}
