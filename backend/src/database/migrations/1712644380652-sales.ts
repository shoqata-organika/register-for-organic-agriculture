import { MigrationInterface, QueryRunner } from "typeorm";

export class Sales1712644380652 implements MigrationInterface {
    name = 'Sales1712644380652'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sales" ALTER COLUMN "description" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sales" ALTER COLUMN "description" SET NOT NULL`);
    }

}
