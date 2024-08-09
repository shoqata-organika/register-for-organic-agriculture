import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDriedEnum1710752958953 implements MigrationInterface {
    name = 'AddDriedEnum1710752958953'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."inventory_items_type_enum" RENAME TO "inventory_items_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."inventory_items_type_enum" AS ENUM('harvested_product', 'dried_product', 'collected_product', 'purchased_product', 'processed_product', 'input', 'planting_material')`);
        await queryRunner.query(`ALTER TABLE "inventory_items" ALTER COLUMN "type" TYPE "public"."inventory_items_type_enum" USING "type"::"text"::"public"."inventory_items_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."inventory_items_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."inventory_items_type_enum_old" AS ENUM('harvested_product', 'collected_product', 'purchased_product', 'processed_product', 'input', 'planting_material')`);
        await queryRunner.query(`ALTER TABLE "inventory_items" ALTER COLUMN "type" TYPE "public"."inventory_items_type_enum_old" USING "type"::"text"::"public"."inventory_items_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."inventory_items_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."inventory_items_type_enum_old" RENAME TO "inventory_items_type_enum"`);
    }

}
