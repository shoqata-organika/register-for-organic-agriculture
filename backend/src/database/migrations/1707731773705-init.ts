import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1707731773705 implements MigrationInterface {
    name = 'Init1707731773705'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "harvesters" ADD "contract_file" character varying`);
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" ALTER COLUMN "from_date" SET DEFAULT '"2023-12-31T23:00:00.000Z"'`);
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" ALTER COLUMN "to_date" SET DEFAULT '"2024-12-30T23:00:00.000Z"'`);
        await queryRunner.query(`ALTER TYPE "public"."members_legal_status_enum" RENAME TO "members_legal_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."members_legal_status_enum" AS ENUM('physical_person', 'llc', 'individual_business', 'agricultural_cooperative')`);
        await queryRunner.query(`ALTER TABLE "members" ALTER COLUMN "legal_status" TYPE "public"."members_legal_status_enum" USING "legal_status"::"text"::"public"."members_legal_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."members_legal_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."members_legal_status_enum_old" AS ENUM('physical_person', 'legal_person')`);
        await queryRunner.query(`ALTER TABLE "members" ALTER COLUMN "legal_status" TYPE "public"."members_legal_status_enum_old" USING "legal_status"::"text"::"public"."members_legal_status_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."members_legal_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."members_legal_status_enum_old" RENAME TO "members_legal_status_enum"`);
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" ALTER COLUMN "to_date" SET DEFAULT '2024-12-31 00:00:00+01'`);
        await queryRunner.query(`ALTER TABLE "land_parcel_crops" ALTER COLUMN "from_date" SET DEFAULT '2024-01-01 00:00:00+01'`);
        await queryRunner.query(`ALTER TABLE "harvesters" DROP COLUMN "contract_file"`);
    }

}
