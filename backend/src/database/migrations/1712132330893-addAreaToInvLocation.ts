import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAreaToInvLocation1712132330893 implements MigrationInterface {
    name = 'AddAreaToInvLocation1712132330893'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory_locations" ADD "area" numeric(18,2)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory_locations" DROP COLUMN "area"`);
    }

}
