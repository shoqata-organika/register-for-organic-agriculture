import { MigrationInterface, QueryRunner } from "typeorm"

export class AddingCrops1713276490116 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
      const codeCategories = await queryRunner.query(`select id from code_categories where api_name = 'CROPS'`);
      const codeCategoryId = codeCategories[0].id;

      const bmaCrops = await queryRunner.query(`select id from code_categories where api_name = 'BMA_CROPS'`);
      const bmaCropsId = bmaCrops[0].id;

      queryRunner.query(`
        INSERT INTO codes (name, name_sq, name_sr, "codeCategoryId")
        VALUES 
         ('Levisticum officinale', 'Levistikum', 'Ljupčac', ${codeCategoryId}),
         ('Mentha piperita', 'Menta', 'Metvica', ${codeCategoryId}),
         ('Mentha spicata', 'Menta', 'Metvica', ${codeCategoryId}),
         ('Taraxacum officinale', 'Luleshurdha', 'Maslačak', ${codeCategoryId}),
         ('Urtica dioica', 'Hithra', 'Kopriva', ${codeCategoryId}),
         ('Ocimum basilicum', 'Borzilok', 'Bosiljak', ${codeCategoryId}),

         ('Achillea millefolium', 'Bar pezmi', 'Stolisnik', ${bmaCropsId}),
         ('Althea officinalis L', 'Mullaga e bardhë', 'Beli slez', ${bmaCropsId}),
         ('Matricaria chamomila', 'Kamomili', 'Kamilica', ${bmaCropsId}),
         ('Melissa officinalis', 'Bari i bletës', 'Pčelinja trava', ${bmaCropsId}),
         ('Sambucus nigra', 'Shtogu', 'Zova/Crna bazga', ${bmaCropsId}),
         ('Champignon Mushrooms', 'Kërpurdha Shampinion', 'Pečurka šampinjona', ${bmaCropsId}),
         ('Alfalfa', 'Jongja', 'Detelina', ${bmaCropsId});
      `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      const codeCategories = await queryRunner.query(`select id from code_categories where api_name = 'CROPS'`);
      const codeCategoryId = codeCategories[0].id;

      const bmaCrops = await queryRunner.query(`select id from code_categories where api_name = 'BMA_CROPS'`);
      const bmaCropsId = bmaCrops[0].id;


      queryRunner.query(`
        DELETE FROM codes
        WHERE 
         (name = 'Levisticum officinale' AND "codeCategoryId" = ${codeCategoryId}),
         (name = 'Mentha piperita' AND "codeCategoryId" = ${codeCategoryId}),
         (name = 'Mentha spicata' AND "codeCategoryId" = ${codeCategoryId}),
         (name = 'Taraxacum officinale' AND "codeCategoryId" = ${codeCategoryId}),
         (name = 'Urtica dioica' AND "codeCategoryId" = ${codeCategoryId}),
         (name = 'Ocimum basilicum' AND "codeCategoryId" = ${codeCategoryId}),

         (name = 'Achillea millefolium' AND "codeCategoryId" = ${bmaCropsId}),
         (name = 'Althea officinalis L' AND "codeCategoryId" = ${bmaCropsId}),
         (name = 'Matricaria chamomila' AND "codeCategoryId" = ${bmaCropsId}),
         (name = 'Melissa officinalis' AND "codeCategoryId" = ${bmaCropsId}),
         (name = 'Sambucus nigra' AND "codeCategoryId" = ${bmaCropsId}),
         (name = 'Champignon Mushrooms' AND "codeCategoryId" = ${bmaCropsId}),
         (name = 'Alfalfa' AND "codeCategoryId" = ${bmaCropsId});
      `);
    }
}
