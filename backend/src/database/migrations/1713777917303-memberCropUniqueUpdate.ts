import { MigrationInterface, QueryRunner } from "typeorm";

export class MemberCropUniqueUpdate1713777917303 implements MigrationInterface {
    name = 'MemberCropUniqueUpdate1713777917303'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "member_crops" DROP CONSTRAINT "UQ_e295f29997bf070ff2873c6b04b"`);
        await queryRunner.query(`ALTER TABLE "member_crops" ADD CONSTRAINT "UQ_d0698886c2849e60eb58702886c" UNIQUE ("code", "member_id", "crop_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "member_crops" DROP CONSTRAINT "UQ_d0698886c2849e60eb58702886c"`);
        await queryRunner.query(`ALTER TABLE "member_crops" ADD CONSTRAINT "UQ_e295f29997bf070ff2873c6b04b" UNIQUE ("code", "member_id")`);
    }

}
