import { MigrationInterface, QueryRunner } from "typeorm"

export class TypeColumn1709125603890 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "processing_activities" DROP COLUMN "type"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
