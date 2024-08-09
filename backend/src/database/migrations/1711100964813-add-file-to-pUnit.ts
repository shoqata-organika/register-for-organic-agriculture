import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFileToPUnit1711100964813 implements MigrationInterface {
    name = 'AddFileToPUnit1711100964813'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "processing_units" ADD "file" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "processing_units" DROP COLUMN "file"`);
    }

}
