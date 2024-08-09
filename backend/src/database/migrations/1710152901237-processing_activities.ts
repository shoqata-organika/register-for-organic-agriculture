import { MigrationInterface, QueryRunner } from "typeorm";

export class ProcessingActivities1710152901237 implements MigrationInterface {
    name = 'ProcessingActivities1710152901237'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "processing_activity_entries" DROP CONSTRAINT "FK_cdf0b66607f7f4645c5d1227be0"`);
        await queryRunner.query(`ALTER TABLE "processing_activities" DROP CONSTRAINT "FK_b1445e1527fb2f3d3cd8a0de16d"`);

        await queryRunner.query(`ALTER TABLE "processing_activity_entries" ADD "inventory_item_id" integer`);

        // find all inventory_item_ids where admission_entry_id is equal to the admission_entry_id in processing_activity_entries and update them 
        await queryRunner.query(`UPDATE processing_activity_entries SET inventory_item_id = (select id from inventory_items where admission_entry_id = processing_activity_entries.admission_entry_id limit 1)`);
        await queryRunner.query(`ALTER TABLE "processing_activity_entries" DROP COLUMN "admission_entry_id"`);
        
        // make inventory_item_id not null 
        await queryRunner.query(`ALTER TABLE "processing_activity_entries" ALTER COLUMN "inventory_item_id" SET NOT NULL`);

        await queryRunner.query(`ALTER TABLE "processing_activities" DROP COLUMN "processing_type_id"`);
        await queryRunner.query(`CREATE TYPE "public"."processing_activities_processing_type_enum" AS ENUM('division', 'drying', 'freezing', 'pressing', 'grinding', 'extraction')`);
        await queryRunner.query(`ALTER TABLE "processing_activities" ADD "processing_type" "public"."processing_activities_processing_type_enum" NOT NULL DEFAULT 'extraction'`);
        await queryRunner.query(`ALTER TABLE "processing_activity_entries" ADD CONSTRAINT "FK_4ccb54dd28812b0ef4a282abb42" FOREIGN KEY ("inventory_item_id") REFERENCES "inventory_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "processing_activity_entries" DROP CONSTRAINT "FK_4ccb54dd28812b0ef4a282abb42"`);
        await queryRunner.query(`ALTER TABLE "processing_activities" DROP COLUMN "processing_type"`);
        await queryRunner.query(`DROP TYPE "public"."processing_activities_processing_type_enum"`);
        await queryRunner.query(`ALTER TABLE "processing_activities" ADD "processing_type" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "processing_activities" RENAME COLUMN "processing_type" TO "processing_type_id"`);
        await queryRunner.query(`ALTER TABLE "processing_activity_entries" RENAME COLUMN "inventory_item_id" TO "admission_entry_id"`);
        await queryRunner.query(`ALTER TABLE "processing_activities" ADD CONSTRAINT "FK_b1445e1527fb2f3d3cd8a0de16d" FOREIGN KEY ("processing_type_id") REFERENCES "codes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "processing_activity_entries" ADD CONSTRAINT "FK_cdf0b66607f7f4645c5d1227be0" FOREIGN KEY ("admission_entry_id") REFERENCES "admission_entries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
