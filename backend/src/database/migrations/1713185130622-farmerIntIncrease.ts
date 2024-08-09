import { MigrationInterface, QueryRunner } from "typeorm";

export class FarmerIntIncrease1713185130622 implements MigrationInterface {
    name = 'FarmerIntIncrease1713185130622'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contracted_farmers" DROP COLUMN "personal_num"`);
        await queryRunner.query(`ALTER TABLE "contracted_farmers" ADD "personal_num" bigint`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contracted_farmers" DROP COLUMN "personal_num"`);
        await queryRunner.query(`ALTER TABLE "contracted_farmers" ADD "personal_num" integer`);
    }

}
