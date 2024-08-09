import { MigrationInterface, QueryRunner } from "typeorm";

export class Expenses1713950307102 implements MigrationInterface {
    name = 'Expenses1713950307102'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "expenses" ADD "farm_activity_id" integer`);
        await queryRunner.query(`ALTER TABLE "expenses" ADD CONSTRAINT "FK_c060b610e64306fe8f0febda0e5" FOREIGN KEY ("farm_activity_id") REFERENCES "farm_activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "expenses" DROP CONSTRAINT "FK_c060b610e64306fe8f0febda0e5"`);
        await queryRunner.query(`ALTER TABLE "expenses" DROP COLUMN "farm_activity_id"`);
    }

}
