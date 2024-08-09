import { MigrationInterface, QueryRunner } from "typeorm";

export class AdminExtension1713796107453 implements MigrationInterface {
    name = 'AdminExtension1713796107453'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "members" ADD "approved_at" TIMESTAMP`);
        await queryRunner.query(`CREATE TYPE "public"."members_approval_status_enum" AS ENUM('approved', 'declined', 'pending')`);
        await queryRunner.query(`ALTER TABLE "members" ADD "approval_status" "public"."members_approval_status_enum" DEFAULT 'pending'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "members" DROP COLUMN "approval_status"`);
        await queryRunner.query(`DROP TYPE "public"."members_approval_status_enum"`);
        await queryRunner.query(`ALTER TABLE "members" DROP COLUMN "approved_at"`);
    }

}
