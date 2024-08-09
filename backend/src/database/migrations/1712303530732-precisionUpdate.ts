import { MigrationInterface, QueryRunner } from "typeorm";

export class PrecisionUpdate1712303530732 implements MigrationInterface {
    name = 'PrecisionUpdate1712303530732'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory_operations" ALTER COLUMN "quantity" TYPE numeric(18,2)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory_operations" ALTER COLUMN "quantity" TYPE numeric(5,2)`);
    }

}
