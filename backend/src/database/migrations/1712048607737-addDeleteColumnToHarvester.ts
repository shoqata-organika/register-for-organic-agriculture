import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeleteColumnToHarvester1712048607737 implements MigrationInterface {
    name = 'AddDeleteColumnToHarvester1712048607737'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "harvesters" ADD "deletedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "harvesters" DROP COLUMN "deletedAt"`);
    }

}
