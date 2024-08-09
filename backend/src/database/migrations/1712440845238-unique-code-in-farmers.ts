import { MigrationInterface, QueryRunner } from "typeorm";

export class UniqueCodeInFarmers1712440845238 implements MigrationInterface {
    name = 'UniqueCodeInFarmers1712440845238'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contracted_farmers" DROP CONSTRAINT "UQ_a05362d3f8dc50a969567bb6228"`);
        await queryRunner.query(`ALTER TABLE "contracted_farmers" ADD CONSTRAINT "UQ_c6a5eddc84aff07a0149e4819d4" UNIQUE ("code", "member_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contracted_farmers" DROP CONSTRAINT "UQ_c6a5eddc84aff07a0149e4819d4"`);
        await queryRunner.query(`ALTER TABLE "contracted_farmers" ADD CONSTRAINT "UQ_a05362d3f8dc50a969567bb6228" UNIQUE ("code")`);
    }

}
