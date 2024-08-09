import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeleteColumn1711807354632 implements MigrationInterface {
    name = 'AddDeleteColumn1711807354632'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contracted_farmers" ADD "deletedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contracted_farmers" DROP COLUMN "deletedAt"`);
    }

}
