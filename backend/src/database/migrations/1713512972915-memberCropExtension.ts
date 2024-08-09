import { MigrationInterface, QueryRunner } from "typeorm";

export class MemberCropExtension1713512972915 implements MigrationInterface {
    name = 'MemberCropExtension1713512972915'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "member_crops" RENAME COLUMN "year" TO "years"`);
        await queryRunner.query(`ALTER TABLE "member_crops" DROP COLUMN "years"`);
        await queryRunner.query(`ALTER TABLE "member_crops" ADD "years" jsonb NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "member_crops" DROP COLUMN "years"`);
        await queryRunner.query(`ALTER TABLE "member_crops" ADD "years" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "member_crops" RENAME COLUMN "years" TO "year"`);
    }

}
