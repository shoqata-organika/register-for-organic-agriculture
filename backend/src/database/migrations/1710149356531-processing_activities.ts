import { MigrationInterface, QueryRunner } from "typeorm";

export class ProcessingActivities1710149356531 implements MigrationInterface {
    name = 'ProcessingActivities1710149356531'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."processing_activity_entries_crop_state_enum" AS ENUM('dry', 'fresh')`);
        await queryRunner.query(`ALTER TABLE "processing_activity_entries" ADD "crop_state" "public"."processing_activity_entries_crop_state_enum" NOT NULL DEFAULT 'dry'`);
        await queryRunner.query(`CREATE TYPE "public"."processing_activity_entries_crop_status_enum" AS ENUM('organic', 'conventional', 'k1', 'k2', 'k3')`);
        await queryRunner.query(`ALTER TABLE "processing_activity_entries" ADD "crop_status" "public"."processing_activity_entries_crop_status_enum" NOT NULL DEFAULT 'organic'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "processing_activity_entries" DROP COLUMN "crop_status"`);
        await queryRunner.query(`DROP TYPE "public"."processing_activity_entries_crop_status_enum"`);
        await queryRunner.query(`ALTER TABLE "processing_activity_entries" DROP COLUMN "crop_state"`);
        await queryRunner.query(`DROP TYPE "public"."processing_activity_entries_crop_state_enum"`);
    }

}
