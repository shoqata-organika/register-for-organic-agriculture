import { MigrationInterface, QueryRunner } from "typeorm"

export class UpdateImageColumn1707295561924 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(
        `ALTER TABLE "contracted_farmers" ALTER COLUMN "image" TYPE varchar;`
      );
      await queryRunner.query(
        `ALTER TABLE "harvesters" ALTER COLUMN "image" TYPE varchar;`
      );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(
        `ALTER TABLE "contracted_farmers" ALTER COLUMN "image" TYPE bytea;`
      );
      await queryRunner.query(
        `ALTER TABLE "harvesters" ALTER COLUMN "image" TYPE bytea;`
      )
    }
}
