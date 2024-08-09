import { MigrationInterface, QueryRunner } from "typeorm";

export class Roles1713905478754 implements MigrationInterface {
    name = 'Roles1713905478754'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "roles" jsonb NOT NULL DEFAULT '["member_admin"]'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "roles"`);
    }

}
