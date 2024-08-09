import { MigrationInterface, QueryRunner } from "typeorm";

export class UniqueCodeInFarmers1712441025542 implements MigrationInterface {
    name = 'UniqueCodeInFarmers1712441025542'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "processing_units" ALTER COLUMN "type_of_processing" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "processing_units" ALTER COLUMN "type_of_processing" SET NOT NULL`);
    }

}
