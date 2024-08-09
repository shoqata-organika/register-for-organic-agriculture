import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveNameColFromMember1713878145730 implements MigrationInterface {
    name = 'RemoveNameColFromMember1713878145730'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "members" DROP COLUMN "name"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "members" ADD "name" character varying NOT NULL`);
    }

}
