import { MigrationInterface, QueryRunner } from "typeorm";

export class DropAddressZone1713183180990 implements MigrationInterface {
    name = 'DropAddressZone1713183180990'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "zones" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "admission_entries" ADD "notes" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admission_entries" DROP COLUMN "notes"`);
        await queryRunner.query(`ALTER TABLE "zones" ADD "address" character varying(500)`);
    }

}
