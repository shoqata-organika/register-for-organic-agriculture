import { MigrationInterface, QueryRunner } from "typeorm";

export class NullableAddressPUnit1711357980464 implements MigrationInterface {
    name = 'NullableAddressPUnit1711357980464'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "processing_units" ALTER COLUMN "address" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "processing_units" ALTER COLUMN "address" SET NOT NULL`);
    }

}
