import { MigrationInterface, QueryRunner } from "typeorm";

export class IncrementingPrecision1711561519992 implements MigrationInterface {
    name = 'IncrementingPrecision1711561519992'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admission_entries" ALTER COLUMN "gross_quantity" TYPE numeric(18,2)`);
        await queryRunner.query(`ALTER TABLE "admission_entries" ALTER COLUMN "net_quantity" TYPE numeric(18,2)`);
        await queryRunner.query(`ALTER TABLE "farm_activities" ALTER COLUMN "quantity" TYPE numeric(18,2)`);
        await queryRunner.query(`ALTER TABLE "farm_activities" ALTER COLUMN "cost" TYPE numeric(18,2)`);
        await queryRunner.query(`ALTER TABLE "farm_activities" ALTER COLUMN "time_spent" TYPE numeric(18,2)`);
        await queryRunner.query(`ALTER TABLE "subparcels" ALTER COLUMN "area" TYPE numeric(18,4)`);
        await queryRunner.query(`ALTER TABLE "land_parcels" ALTER COLUMN "total_area" TYPE numeric(18,2)`);
        await queryRunner.query(`ALTER TABLE "land_parcels" ALTER COLUMN "utilised_area" TYPE numeric(18,2)`);
        await queryRunner.query(`ALTER TABLE "processing_activity_entries" ALTER COLUMN "gross_quantity" TYPE numeric(18,2)`);
        await queryRunner.query(`ALTER TABLE "processing_activity_entries" ALTER COLUMN "net_quantity" TYPE numeric(18,2)`);
        await queryRunner.query(`ALTER TABLE "processing_activity_entries" ALTER COLUMN "firo" TYPE numeric(18,2)`);
        await queryRunner.query(`ALTER TABLE "inventory_items" ALTER COLUMN "quantity" TYPE numeric(18,2)`);
        await queryRunner.query(`ALTER TABLE "inventory_items" ALTER COLUMN "cost" TYPE numeric(18,2)`);
        await queryRunner.query(`ALTER TABLE "sales" ALTER COLUMN "quantity" TYPE numeric(18,2)`);
        await queryRunner.query(`ALTER TABLE "sales" ALTER COLUMN "price_per_unit" TYPE numeric(18,2)`);
        await queryRunner.query(`ALTER TABLE "expenses" ALTER COLUMN "quantity" TYPE numeric(18,2)`);
        await queryRunner.query(`ALTER TABLE "expenses" ALTER COLUMN "price_per_unit" TYPE numeric(18,2)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "expenses" ALTER COLUMN "price_per_unit" TYPE numeric(8,2)`);
        await queryRunner.query(`ALTER TABLE "expenses" ALTER COLUMN "quantity" TYPE numeric(8,2)`);
        await queryRunner.query(`ALTER TABLE "sales" ALTER COLUMN "price_per_unit" TYPE numeric(8,2)`);
        await queryRunner.query(`ALTER TABLE "sales" ALTER COLUMN "quantity" TYPE numeric(8,2)`);
        await queryRunner.query(`ALTER TABLE "inventory_items" ALTER COLUMN "cost" TYPE numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "inventory_items" ALTER COLUMN "quantity" TYPE numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "processing_activity_entries" ALTER COLUMN "firo" TYPE numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "processing_activity_entries" ALTER COLUMN "net_quantity" TYPE numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "processing_activity_entries" ALTER COLUMN "gross_quantity" TYPE numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "land_parcels" ALTER COLUMN "utilised_area" TYPE numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "land_parcels" ALTER COLUMN "total_area" TYPE numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "subparcels" ALTER COLUMN "area" TYPE numeric(8,4)`);
        await queryRunner.query(`ALTER TABLE "farm_activities" ALTER COLUMN "time_spent" TYPE numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "farm_activities" ALTER COLUMN "cost" TYPE numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "farm_activities" ALTER COLUMN "quantity" TYPE numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "admission_entries" ALTER COLUMN "net_quantity" TYPE numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "admission_entries" ALTER COLUMN "gross_quantity" TYPE numeric(5,2)`);
    }

}
