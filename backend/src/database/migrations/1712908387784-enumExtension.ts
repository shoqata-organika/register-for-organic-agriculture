import { MigrationInterface, QueryRunner } from "typeorm";

export class EnumExtension1712908387784 implements MigrationInterface {
    name = 'EnumExtension1712908387784'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."processing_activities_processing_type_enum" RENAME TO "processing_activities_processing_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."processing_activities_processing_type_enum" AS ENUM('division', 'drying', 'freezing', 'pressing', 'grinding', 'extraction', 'incision', 'blending', 'fermentation', 'filtering')`);
        await queryRunner.query(`ALTER TABLE "processing_activities" ALTER COLUMN "processing_type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "processing_activities" ALTER COLUMN "processing_type" TYPE "public"."processing_activities_processing_type_enum" USING "processing_type"::"text"::"public"."processing_activities_processing_type_enum"`);
        await queryRunner.query(`ALTER TABLE "processing_activities" ALTER COLUMN "processing_type" SET DEFAULT 'extraction'`);
        await queryRunner.query(`DROP TYPE "public"."processing_activities_processing_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."processing_activities_processing_type_enum_old" AS ENUM('division', 'drying', 'freezing', 'pressing', 'grinding', 'extraction')`);
        await queryRunner.query(`ALTER TABLE "processing_activities" ALTER COLUMN "processing_type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "processing_activities" ALTER COLUMN "processing_type" TYPE "public"."processing_activities_processing_type_enum_old" USING "processing_type"::"text"::"public"."processing_activities_processing_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "processing_activities" ALTER COLUMN "processing_type" SET DEFAULT 'extraction'`);
        await queryRunner.query(`DROP TYPE "public"."processing_activities_processing_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."processing_activities_processing_type_enum_old" RENAME TO "processing_activities_processing_type_enum"`);
    }

}
