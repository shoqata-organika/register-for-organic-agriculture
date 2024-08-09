import { MigrationInterface, QueryRunner } from "typeorm"

export class AddProcessingTypesCodes1712911874513 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
      const codeCategories = await queryRunner.query(`select id from code_categories where api_name = 'PROCESSING_TYPES'`);
      const codeCategoryId = codeCategories[0].id;

      await queryRunner.query(`
        INSERT INTO codes (name, name_sq, name_sr, "codeCategoryId")
        VALUES 
          ('Incision', 'Prerje', 'Urezivanje', ${codeCategoryId}),
          ('Blending', 'Bluarje', 'Blending', ${codeCategoryId}),
          ('Fermentation', 'Fermentim', 'Fermentacija', ${codeCategoryId}),
          ('Filtering', 'Sitja', 'Filtering', ${codeCategoryId});
      `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      const codeCategories = await queryRunner.query(`select id from code_categories where api_name = 'PROCESSING_TYPES'`);
      const codeCategoryId = codeCategories[0].id;

      await queryRunner.query(`
        DELETE FROM codes 
        WHERE 
          (name = 'Incision' AND "codeCategoryId" = ${codeCategoryId}) OR 
          (name = 'Blending' AND "codeCategoryId" = ${codeCategoryId}) OR 
          (name = 'Fermentation' AND "codeCategoryId" = ${codeCategoryId}) OR 
          (name = 'Filtering' AND "codeCategoryId" = ${codeCategoryId});
      `);
    }
}
