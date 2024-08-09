import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import * as fs from 'fs';
import { CodeCategory } from '../../modules/code-categories/code-category.entity';

export default class CropSeeder implements Seeder {
  async run(dataSource: DataSource) {
    // read activities from activities.csv

    console.log('Seeding crops...');

    const repo = dataSource.getRepository(CodeCategory);

    await dataSource.query(
      'DELETE FROM codes WHERE "codeCategoryId" IN (SELECT id FROM code_categories WHERE api_name = \'CROP_PARTS\')',
    );
    await repo.delete({ api_name: 'CROP_PARTS' });

    await dataSource.query(
      'DELETE FROM codes WHERE "codeCategoryId" IN (SELECT id FROM code_categories WHERE api_name = \'CROPS\')',
    );
    await repo.delete({ api_name: 'CROPS' });

    // parse JSON file "./crops_data_grouped.json"
    const crops = JSON.parse(
      fs.readFileSync(__dirname + '/crops_data_grouped.json').toString(),
    );

    const parts = crops
      .map((crop) => crop.parts.map((part) => part.name.toLowerCase()))
      .flat()
      .filter((part, index, self) => self.indexOf(part) === index);

    const category = {
      api_name: 'CROPS',
      name: 'Crops',
      name_sq: 'Kulturat',
      name_sr: 'Kulture',
      codes: [],
    };

    let partsCategory = {
      api_name: 'CROP_PARTS',
      name: 'Crop Parts',
      name_sq: 'Pjesët e kulturave',
      name_sr: 'Delovi kultura',
      codes: [],
    };

    parts.forEach((part) => {
      const partCode = {
        name: part,
        name_sq: part,
        name_sr: part,
      };

      partsCategory.codes.push(partCode);
    });

    await dataSource.getRepository(CodeCategory).save(partsCategory);

    // reload partsCategory so that it has an id and loads the codes
    // that we just saved
    partsCategory = await dataSource.getRepository(CodeCategory).findOne({
      where: { api_name: 'CROP_PARTS' },
      relations: { codes: true },
    });

    crops.forEach((crop) => {
      const cropCode = {
        name: crop.name,
        name_sq: crop.name_sq,
        name_sr: crop.name_sr,
        subCodes: crop.parts
          .map((part) =>
            partsCategory.codes.find(
              (code) => code.name.toLowerCase() === part.name.toLowerCase(),
            ),
          )
          .filter((code) => code !== undefined),
      };

      category.codes.push(cropCode);
    });

    await dataSource.getRepository(CodeCategory).save(category);
  }
}
