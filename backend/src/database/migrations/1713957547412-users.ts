import { MigrationInterface, QueryRunner } from "typeorm";

export class Users1713957547412 implements MigrationInterface {
    name = 'Users1713957547412'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_930e69d96a9cf9bdc32b7a49db1"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "member_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_930e69d96a9cf9bdc32b7a49db1" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_930e69d96a9cf9bdc32b7a49db1"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "member_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_930e69d96a9cf9bdc32b7a49db1" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
