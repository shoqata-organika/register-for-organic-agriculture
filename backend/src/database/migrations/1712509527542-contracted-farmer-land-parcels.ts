import { MigrationInterface, QueryRunner } from "typeorm";

export class ContractedFarmerLandParcels1712509527542 implements MigrationInterface {
    name = 'ContractedFarmerLandParcels1712509527542'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "land_parcels" ADD "contracted_farmer_id" integer`);
        await queryRunner.query(`ALTER TABLE "land_parcels" ALTER COLUMN "location" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "land_parcels" ALTER COLUMN "total_area" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "land_parcels" ALTER COLUMN "utilised_area" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "land_parcels" ADD CONSTRAINT "FK_70a67e96323a5304bdd1d17eeb3" FOREIGN KEY ("contracted_farmer_id") REFERENCES "contracted_farmers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "land_parcels" DROP CONSTRAINT "FK_70a67e96323a5304bdd1d17eeb3"`);
        await queryRunner.query(`ALTER TABLE "land_parcels" ALTER COLUMN "utilised_area" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "land_parcels" ALTER COLUMN "total_area" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "land_parcels" ALTER COLUMN "location" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "land_parcels" DROP COLUMN "contracted_farmer_id"`);
    }

}
