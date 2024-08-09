import { MigrationInterface, QueryRunner } from "typeorm";

export class MemberCropFix1713531049528 implements MigrationInterface {
    name = 'MemberCropFix1713531049528'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "member_crops" DROP CONSTRAINT "FK_b7874ad057af41301a1bfd664be"`);
        await queryRunner.query(`ALTER TABLE "member_crops" DROP CONSTRAINT "FK_0368e5abe613b60a4db245105ce"`);
        await queryRunner.query(`ALTER TABLE "member_crops" DROP CONSTRAINT "UQ_e295f29997bf070ff2873c6b04b"`);
        await queryRunner.query(`ALTER TABLE "member_crops" ALTER COLUMN "crop_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "member_crops" ALTER COLUMN "member_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "member_crops" ADD CONSTRAINT "UQ_e295f29997bf070ff2873c6b04b" UNIQUE ("code", "member_id")`);
        await queryRunner.query(`ALTER TABLE "member_crops" ADD CONSTRAINT "FK_b7874ad057af41301a1bfd664be" FOREIGN KEY ("crop_id") REFERENCES "codes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "member_crops" ADD CONSTRAINT "FK_0368e5abe613b60a4db245105ce" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "member_crops" DROP CONSTRAINT "FK_0368e5abe613b60a4db245105ce"`);
        await queryRunner.query(`ALTER TABLE "member_crops" DROP CONSTRAINT "FK_b7874ad057af41301a1bfd664be"`);
        await queryRunner.query(`ALTER TABLE "member_crops" DROP CONSTRAINT "UQ_e295f29997bf070ff2873c6b04b"`);
        await queryRunner.query(`ALTER TABLE "member_crops" ALTER COLUMN "member_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "member_crops" ALTER COLUMN "crop_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "member_crops" ADD CONSTRAINT "UQ_e295f29997bf070ff2873c6b04b" UNIQUE ("code", "member_id")`);
        await queryRunner.query(`ALTER TABLE "member_crops" ADD CONSTRAINT "FK_0368e5abe613b60a4db245105ce" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "member_crops" ADD CONSTRAINT "FK_b7874ad057af41301a1bfd664be" FOREIGN KEY ("crop_id") REFERENCES "codes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
