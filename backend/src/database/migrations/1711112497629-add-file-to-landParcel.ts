import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFileToLandParcel1711112497629 implements MigrationInterface {
    name = 'AddFileToLandParcel1711112497629'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "land_parcels" ADD "file" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "land_parcels" DROP COLUMN "file"`);
    }

}
