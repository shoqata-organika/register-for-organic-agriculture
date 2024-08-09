import { MigrationInterface, QueryRunner } from "typeorm";

export class InventoryOperations1713946014876 implements MigrationInterface {
    name = 'InventoryOperations1713946014876'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory_operations" ADD "date" date`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory_operations" DROP COLUMN "date"`);
    }

}
