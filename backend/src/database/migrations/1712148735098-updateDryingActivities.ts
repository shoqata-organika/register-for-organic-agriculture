import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDryingActivities1712148735098 implements MigrationInterface {
    name = 'UpdateDryingActivities1712148735098'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "processing_activities" ADD "drier_temp" integer`);
        await queryRunner.query(`ALTER TABLE "processing_activities" ADD "drier_start_hour" numeric`);
        await queryRunner.query(`ALTER TABLE "processing_activities" ADD "drier_end_hour" numeric`);
        await queryRunner.query(`ALTER TABLE "processing_activities" ADD "drying_start_date" date`);
        await queryRunner.query(`ALTER TABLE "processing_activities" ADD "drying_end_date" date`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "processing_activities" DROP COLUMN "drying_end_date"`);
        await queryRunner.query(`ALTER TABLE "processing_activities" DROP COLUMN "drying_start_date"`);
        await queryRunner.query(`ALTER TABLE "processing_activities" DROP COLUMN "drier_end_hour"`);
        await queryRunner.query(`ALTER TABLE "processing_activities" DROP COLUMN "drier_start_hour"`);
        await queryRunner.query(`ALTER TABLE "processing_activities" DROP COLUMN "drier_temp"`);
    }

}
