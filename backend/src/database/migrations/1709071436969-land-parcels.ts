import { MigrationInterface, QueryRunner } from "typeorm";

export class LandParcels1709071436969 implements MigrationInterface {
    name = 'LandParcels1709071436969'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" DROP CONSTRAINT "FK_0c38289c417daa7adb4af2187b9"`);
        await queryRunner.query(`ALTER TABLE "subparcels" DROP CONSTRAINT "PK_7c4f461f28a4bc933019ee5f2ac"`);
        await queryRunner.query(`ALTER TABLE "subparcels" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "subparcels" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "subparcels" ADD CONSTRAINT "PK_7c4f461f28a4bc933019ee5f2ac" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" DROP COLUMN "sub_parcel_id"`);
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" ADD "sub_parcel_id" uuid`);
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" ADD CONSTRAINT "FK_0c38289c417daa7adb4af2187b9" FOREIGN KEY ("sub_parcel_id") REFERENCES "subparcels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" DROP CONSTRAINT "FK_0c38289c417daa7adb4af2187b9"`);
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" DROP COLUMN "sub_parcel_id"`);
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" ADD "sub_parcel_id" integer`);
        await queryRunner.query(`ALTER TABLE "subparcels" DROP CONSTRAINT "PK_7c4f461f28a4bc933019ee5f2ac"`);
        await queryRunner.query(`ALTER TABLE "subparcels" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "subparcels" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subparcels" ADD CONSTRAINT "PK_7c4f461f28a4bc933019ee5f2ac" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" ADD CONSTRAINT "FK_0c38289c417daa7adb4af2187b9" FOREIGN KEY ("sub_parcel_id") REFERENCES "subparcels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
