import { MigrationInterface, QueryRunner } from "typeorm";

export class InventoryOperations1713949386130 implements MigrationInterface {
    name = 'InventoryOperations1713949386130'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "expenses" DROP COLUMN "supplier"`);
        await queryRunner.query(`CREATE TYPE "public"."expenses_type_enum" AS ENUM('other', 'land_ploughing', 'milling', 'bed_preparation')`);
        await queryRunner.query(`ALTER TABLE "expenses" ADD "type" "public"."expenses_type_enum" NOT NULL DEFAULT 'other'`);
        await queryRunner.query(`ALTER TABLE "expenses" ADD "supplier_id" uuid`);
        await queryRunner.query(`ALTER TABLE "expenses" ADD CONSTRAINT "FK_a30707018a9722e9551db12ea8a" FOREIGN KEY ("supplier_id") REFERENCES "member_resources"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "expenses" DROP CONSTRAINT "FK_a30707018a9722e9551db12ea8a"`);
        await queryRunner.query(`ALTER TABLE "expenses" DROP COLUMN "supplier_id"`);
        await queryRunner.query(`ALTER TABLE "expenses" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."expenses_type_enum"`);
        await queryRunner.query(`ALTER TABLE "expenses" ADD "supplier" character varying NOT NULL`);
    }

}
