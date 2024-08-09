import { MigrationInterface, QueryRunner } from "typeorm";

export class ContractedFarmerLandParcels1712509659714 implements MigrationInterface {
    name = 'ContractedFarmerLandParcels1712509659714'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "land_parcels" DROP CONSTRAINT "code_member_index"`);
        await queryRunner.query(`ALTER TABLE "land_parcels" ADD CONSTRAINT "UQ_b7a9e781adbfd15a3ece08d613a" UNIQUE ("code", "member_id", "contracted_farmer_id")`);

        const result = await queryRunner.query('select id, land_parcels, member_id from contracted_farmers');

        await Promise.all(result.map((cf) => { 
            console.log('cf_id:', cf.id);

            const landParcels = typeof cf.land_parcels === 'string' ? JSON.parse(cf.land_parcels) : [];

            return Promise.all(landParcels.map(async (lp) => { 
                return queryRunner.query('insert into land_parcels (code, member_id, contracted_farmer_id) values ($1, $2, $3)', [lp.code, cf.member_id, cf.id]);
            }))
        }));

        await queryRunner.query(`ALTER TABLE "contracted_farmers" DROP COLUMN "land_parcels"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "land_parcels" DROP CONSTRAINT "UQ_b7a9e781adbfd15a3ece08d613a"`);
        await queryRunner.query(`ALTER TABLE "contracted_farmers" ADD "land_parcels" jsonb NOT NULL`);
        await queryRunner.query(`ALTER TABLE "land_parcels" ADD CONSTRAINT "code_member_index" UNIQUE ("code", "member_id")`);
    }

}
