import { MigrationInterface, QueryRunner } from "typeorm";

export class ProcessingActivities1710145736282 implements MigrationInterface {
    name = 'ProcessingActivities1710145736282'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "processing_activities" DROP CONSTRAINT "FK_d1b578e50d16afe770ba450acf3"`);
        await queryRunner.query(`ALTER TABLE "processing_activities" DROP CONSTRAINT "FK_1af589d9a5f680ee7689f4a6c9e"`);
        await queryRunner.query(`ALTER TABLE "processing_activities" DROP CONSTRAINT "FK_acc62ac8ea344867d6cde79b57c"`);
        await queryRunner.query(`CREATE TABLE "processing_activity_entries" ("id" SERIAL NOT NULL, "admission_entry_id" integer NOT NULL, "processing_activity_id" integer NOT NULL, "crop_id" integer NOT NULL, "part_of_crop_id" integer NOT NULL, "gross_quantity" numeric(5,2), "net_quantity" numeric(5,2), "firo" numeric(5,2), "fraction" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a67d8534a71a37fc55989ca1d6f" PRIMARY KEY ("id"))`);

        // migrate data from processing_activities to processing_activity_entries
        await queryRunner.query(`INSERT INTO processing_activity_entries (admission_entry_id, processing_activity_id, crop_id, part_of_crop_id, gross_quantity, net_quantity, firo, fraction, created_at, updated_at) SELECT admission_entry_id, id, crop_id, part_of_crop_id, gross_quantity, net_quantity, firo, fraction, created_at, updated_at FROM processing_activities`);

        await queryRunner.query(`ALTER TABLE "processing_activities" DROP COLUMN "crop_state"`);
        await queryRunner.query(`DROP TYPE "public"."processing_activities_crop_state_enum"`);
        await queryRunner.query(`ALTER TABLE "processing_activities" DROP COLUMN "crop_status"`);
        await queryRunner.query(`DROP TYPE "public"."processing_activities_crop_status_enum"`);
        await queryRunner.query(`ALTER TABLE "processing_activities" DROP COLUMN "gross_quantity"`);
        await queryRunner.query(`ALTER TABLE "processing_activities" DROP COLUMN "net_quantity"`);
        await queryRunner.query(`ALTER TABLE "processing_activities" DROP COLUMN "firo"`);
        await queryRunner.query(`ALTER TABLE "processing_activities" DROP COLUMN "crop_id"`);
        await queryRunner.query(`ALTER TABLE "processing_activities" DROP COLUMN "part_of_crop_id"`);
        await queryRunner.query(`ALTER TABLE "processing_activities" DROP COLUMN "fraction"`);
        await queryRunner.query(`ALTER TABLE "processing_activities" DROP COLUMN "admission_entry_id"`);
        await queryRunner.query(`ALTER TABLE "processing_activity_entries" ADD CONSTRAINT "FK_cdf0b66607f7f4645c5d1227be0" FOREIGN KEY ("admission_entry_id") REFERENCES "admission_entries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "processing_activity_entries" ADD CONSTRAINT "FK_198a47b8f29798f9ef6ce67ba81" FOREIGN KEY ("processing_activity_id") REFERENCES "processing_activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "processing_activity_entries" ADD CONSTRAINT "FK_de9086fd62209027732b820b5e9" FOREIGN KEY ("crop_id") REFERENCES "codes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "processing_activity_entries" ADD CONSTRAINT "FK_5d72865a8b2f19ceff65f541db0" FOREIGN KEY ("part_of_crop_id") REFERENCES "codes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "processing_activity_entries" DROP CONSTRAINT "FK_5d72865a8b2f19ceff65f541db0"`);
        await queryRunner.query(`ALTER TABLE "processing_activity_entries" DROP CONSTRAINT "FK_de9086fd62209027732b820b5e9"`);
        await queryRunner.query(`ALTER TABLE "processing_activity_entries" DROP CONSTRAINT "FK_198a47b8f29798f9ef6ce67ba81"`);
        await queryRunner.query(`ALTER TABLE "processing_activity_entries" DROP CONSTRAINT "FK_cdf0b66607f7f4645c5d1227be0"`);
        await queryRunner.query(`ALTER TABLE "processing_activities" ADD "admission_entry_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "processing_activities" ADD "fraction" character varying`);
        await queryRunner.query(`ALTER TABLE "processing_activities" ADD "part_of_crop_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "processing_activities" ADD "crop_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "processing_activities" ADD "firo" numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "processing_activities" ADD "net_quantity" numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "processing_activities" ADD "gross_quantity" numeric(5,2)`);
        await queryRunner.query(`CREATE TYPE "public"."processing_activities_crop_status_enum" AS ENUM('organic', 'conventional', 'k1', 'k2', 'k3')`);
        await queryRunner.query(`ALTER TABLE "processing_activities" ADD "crop_status" "public"."processing_activities_crop_status_enum" NOT NULL DEFAULT 'organic'`);
        await queryRunner.query(`CREATE TYPE "public"."processing_activities_crop_state_enum" AS ENUM('dry', 'fresh')`);
        await queryRunner.query(`ALTER TABLE "processing_activities" ADD "crop_state" "public"."processing_activities_crop_state_enum" NOT NULL DEFAULT 'dry'`);
        await queryRunner.query(`DROP TABLE "processing_activity_entries"`);
        await queryRunner.query(`ALTER TABLE "processing_activities" ADD CONSTRAINT "FK_acc62ac8ea344867d6cde79b57c" FOREIGN KEY ("admission_entry_id") REFERENCES "admission_entries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "processing_activities" ADD CONSTRAINT "FK_1af589d9a5f680ee7689f4a6c9e" FOREIGN KEY ("part_of_crop_id") REFERENCES "codes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "processing_activities" ADD CONSTRAINT "FK_d1b578e50d16afe770ba450acf3" FOREIGN KEY ("crop_id") REFERENCES "codes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
