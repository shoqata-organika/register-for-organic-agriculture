import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCode1714475214129 implements MigrationInterface {
    name = 'AddCode1714475214129'

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`ALTER TABLE "codes" ADD "code" character varying`);

      const crops = await queryRunner.query(`SELECT id FROM code_categories WHERE api_name = 'CROPS'`);
      const bma_crops = await queryRunner.query(`SELECT id FROM code_categories WHERE api_name = 'BMA_CROPS'`);
      const cropsId = crops[0].id;
      const bma_cropsId = bma_crops[0].id;
      
      const bmaCropsToDelete = [
        'Mellissa officinalis',
        'Matricaria chamomilla',
        'Origanum heracleticum',
        'Origanum vulgaris',
        'Althea officinalis L',
      ].map((name) => `'${name.replace(/'/g, "''")}'`);

      const cropsToDelete = [
        'alfalfa',
        'althea officinalis l',
        'centaurium umbellatum',
        'epilobium angustifolium',
        'lavandula vera',
        'levisticum officinale',
        'mentha piperita',
        'mentha spicata',
        'mellissa officinalis',
        'ocimum basilicum',
        'primula officinalis',
        'thymus longicaulis',
        'triticum vulgaris',
      ].map((name) => `'${name.replace(/'/g, "''")}'`);

      const allCropsToDelete = bmaCropsToDelete.concat(cropsToDelete);

      for (const crop of allCropsToDelete) {
        const existingCrop = await queryRunner.query(`SELECT * FROM codes WHERE name = ${crop}`);

        const cropId = existingCrop?.[0]?.id;
        const codeCategoryId = existingCrop?.[0]?.codeCategoryId;

        if (!cropId) continue;

        const admissionEntriesToDelete = await queryRunner.query(`
          SELECT * FROM admission_entries
          WHERE crop_id = ${cropId};
        `);

        const admissionId = admissionEntriesToDelete?.[0]?.admission_id;

        if (!admissionId) continue; 

        const inventoryItemToDelete = await queryRunner.query(`
          SELECT id FROM inventory_items WHERE crop_id = ${cropId};
        `)

        for (const invItem of inventoryItemToDelete) {
          const invId = invItem.id;

          const processingActivityToDelete = await queryRunner.query(`
            SELECT * FROM processing_activity_entries WHERE inventory_item_id = ${invId};
          `)

          await queryRunner.query(`
            DELETE FROM inventory_operations
            WHERE inventory_item_id = ${invId};
          `);

          await queryRunner.query(`
            DELETE FROM sales
            WHERE inventory_item_id = ${invId};
          `);

          const processingActivityId = processingActivityToDelete?.[0]?.processing_activity_id;

          if (processingActivityId) {
            await queryRunner.query(`
              DELETE FROM processing_activity_entries
              WHERE processing_activity_id = ${processingActivityId};
            `);

            await queryRunner.query(`
              DELETE FROM processing_activities
              WHERE id = ${processingActivityId};
            `);
          }
        }

        await queryRunner.query(`
          DELETE FROM inventory_items
          WHERE crop_id = ${cropId};
        `);

        await queryRunner.query(`
          DELETE FROM admission_entries
          WHERE crop_id = ${cropId};
        `)

        await queryRunner.query(`
          DELETE FROM admissions
          WHERE id = ${admissionId};
        `)

        await queryRunner.query(`
          DELETE FROM farm_activities
          WHERE crop_id = ${cropId};
        `)

        await queryRunner.query(`
          DELETE FROM land_parcel_crops
          WHERE crop_id = ${cropId};
        `)

        await queryRunner.query(`
          DELETE FROM codes
          WHERE id = ${cropId}
          AND "codeCategoryId" = $1;
        `, [codeCategoryId]);
      }

      // Add missing crop codes
      await queryRunner.query(`
        INSERT INTO codes (name, name_sq, name_sr, "codeCategoryId")
        VALUES 
         ('Capsella bursa-pastoris', 'Trasta e bariut', 'Hoču neču', ${cropsId}),
         ('Hypericum perforatum', 'Lulebalsami', 'Kantarion', ${cropsId}),
         ('Rosa canina', 'Trëndafili I egër (Kaça)', 'Šipurak', ${cropsId}),

         ('Centaurea cyanus var. red', 'Ciani kuq', 'Cian crven', ${bma_cropsId}),
         ('Origanum onites / heracleotucum', 'Rigoni i bardhë', 'Mravinac', ${bma_cropsId}),
         ('Petroselinum crispum', 'Majdanozi', 'Peršun', ${bma_cropsId});
      `);

        await queryRunner.query(`
          CREATE SEQUENCE crops_sequence
          START WITH 1
          INCREMENT BY 1
          NO MINVALUE
          NO MAXVALUE
          CACHE 1;
        `);

        await queryRunner.query(`
          CREATE SEQUENCE bmacrops_sequence
          START WITH 1
          INCREMENT BY 1
          NO MINVALUE
          NO MAXVALUE
          CACHE 1;
        `);

        await queryRunner.query(`
          UPDATE codes
          SET code = nextval('crops_sequence')::text
          FROM (
            SELECT id
            FROM codes
            WHERE "codeCategoryId" = $1
            ORDER BY name ASC
          ) AS ordered_codes
          WHERE codes.id = ordered_codes.id;
        `, [cropsId]);

        await queryRunner.query(`
          UPDATE codes
          SET code = nextval('bmacrops_sequence')::text
          FROM (
            SELECT id
            FROM codes
            WHERE "codeCategoryId" = $1
            ORDER BY name ASC
          ) AS ordered_codes
          WHERE codes.id = ordered_codes.id;
        `, [bma_cropsId]);

        await queryRunner.query('DROP SEQUENCE crops_sequence, bmacrops_sequence;');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "codes" DROP COLUMN "code"`);
    }
}
