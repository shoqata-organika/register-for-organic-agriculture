import { MigrationInterface, QueryRunner } from "typeorm";

export class ProcessingMethodUpdate1711030853799 implements MigrationInterface {
    name = 'ProcessingMethodUpdate1711030853799'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "processing_activities" DROP CONSTRAINT "FK_27d0d5aa514a53f16fe978afae7"`);
        await queryRunner.query(`ALTER TABLE "processing_activities" ALTER COLUMN "processing_method_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "processing_activities" ADD CONSTRAINT "FK_27d0d5aa514a53f16fe978afae7" FOREIGN KEY ("processing_method_id") REFERENCES "codes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "processing_activities" DROP CONSTRAINT "FK_27d0d5aa514a53f16fe978afae7"`);
        await queryRunner.query(`ALTER TABLE "processing_activities" ALTER COLUMN "processing_method_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "processing_activities" ADD CONSTRAINT "FK_27d0d5aa514a53f16fe978afae7" FOREIGN KEY ("processing_method_id") REFERENCES "codes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
