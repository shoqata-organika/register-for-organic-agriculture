import { MigrationInterface, QueryRunner } from "typeorm";

export class Expenses1713950461540 implements MigrationInterface {
    name = 'Expenses1713950461540'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "expenses" ALTER COLUMN "product" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "expenses" ALTER COLUMN "product" SET NOT NULL`);
    }

}
