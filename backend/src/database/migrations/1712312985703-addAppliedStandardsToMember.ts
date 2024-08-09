import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAppliedStandardsToMember1712312985703 implements MigrationInterface {
    name = 'AddAppliedStandardsToMember1712312985703'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "members" ADD "applied_standards" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "members" DROP COLUMN "applied_standards"`);
    }

}
