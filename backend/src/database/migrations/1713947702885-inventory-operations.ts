import { MigrationInterface, QueryRunner } from "typeorm";

export class InventoryOperations1713947702885 implements MigrationInterface {
    name = 'InventoryOperations1713947702885'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory_operations" ADD "farm_activity_id" integer`);
        await queryRunner.query(`ALTER TABLE "inventory_operations" ADD CONSTRAINT "FK_f03a05e15e65567e3125de1a3b1" FOREIGN KEY ("farm_activity_id") REFERENCES "farm_activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory_operations" DROP CONSTRAINT "FK_f03a05e15e65567e3125de1a3b1"`);
        await queryRunner.query(`ALTER TABLE "inventory_operations" DROP COLUMN "farm_activity_id"`);
    }

}
