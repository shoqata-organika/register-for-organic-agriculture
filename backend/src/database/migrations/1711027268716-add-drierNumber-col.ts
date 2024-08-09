import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDrierNumberCol1711027268716 implements MigrationInterface {
    name = 'AddDrierNumberCol1711027268716'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "processing_activities" ADD "drier_number" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "processing_activities" DROP COLUMN "drier_number"`);
    }

}
