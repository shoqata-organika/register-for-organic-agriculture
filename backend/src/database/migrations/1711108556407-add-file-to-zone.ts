import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFileToZone1711108556407 implements MigrationInterface {
    name = 'AddFileToZone1711108556407'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "zones" ADD "file" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "zones" DROP COLUMN "file"`);
    }

}
