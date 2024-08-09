import { MigrationInterface, QueryRunner } from "typeorm";

export class LandParcels1709069206394 implements MigrationInterface {
    name = 'LandParcels1709069206394'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "subparcels" ("id" SERIAL NOT NULL, "code" character varying NOT NULL, "land_parcel_id" integer NOT NULL, "area" numeric(8,4) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7c4f461f28a4bc933019ee5f2ac" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" DROP COLUMN "area"`);
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" ADD "year" integer NOT NULL DEFAULT '2024'`);
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" DROP COLUMN "planting_date"`);
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" ADD "planting_date" date NOT NULL DEFAULT '"2023-12-31T23:00:00.000Z"'`);
        await queryRunner.query(`ALTER TABLE "land_parcels" ALTER COLUMN "buffer_zone" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "land_parcels" ALTER COLUMN "buffer_zone" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "subparcels" ADD CONSTRAINT "FK_7811e5815336445bcca3246daa1" FOREIGN KEY ("land_parcel_id") REFERENCES "land_parcels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subparcels" DROP CONSTRAINT "FK_7811e5815336445bcca3246daa1"`);
        await queryRunner.query(`ALTER TABLE "land_parcels" ALTER COLUMN "buffer_zone" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "land_parcels" ALTER COLUMN "buffer_zone" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" DROP COLUMN "planting_date"`);
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" ADD "planting_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT '2024-01-01 00:00:00+01'`);
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" DROP COLUMN "year"`);
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" ADD "area" numeric(5,2) NOT NULL`);
        await queryRunner.query(`DROP TABLE "subparcels"`);
    }

}
