import { MigrationInterface, QueryRunner } from "typeorm";

export class ProcessingActivities1710149521814 implements MigrationInterface {
    name = 'ProcessingActivities1710149521814'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "processing_activities" ADD "parent_activity_id" integer`);
        await queryRunner.query(`ALTER TABLE "processing_activities" ADD CONSTRAINT "UQ_3ec165eebfb009d3fc4406b19b2" UNIQUE ("parent_activity_id")`);
        await queryRunner.query(`ALTER TABLE "processing_activities" ADD CONSTRAINT "FK_3ec165eebfb009d3fc4406b19b2" FOREIGN KEY ("parent_activity_id") REFERENCES "processing_activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "processing_activities" DROP CONSTRAINT "FK_3ec165eebfb009d3fc4406b19b2"`);
        await queryRunner.query(`ALTER TABLE "processing_activities" DROP CONSTRAINT "UQ_3ec165eebfb009d3fc4406b19b2"`);
        await queryRunner.query(`ALTER TABLE "processing_activities" DROP COLUMN "parent_activity_id"`);
    }

}
