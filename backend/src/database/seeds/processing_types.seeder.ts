import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

import { CodeCategory } from '../../modules/code-categories/code-category.entity';
export default class ProcessingTypesSeeder implements Seeder {
  async run(dataSource: DataSource) {
    const category = {
      api_name: 'PROCESSING_TYPES',
      name: 'Processing Types',
      name_sq: 'Llojet e përpunimit',
      name_sr: 'Vrste prerade',
      codes: [],
    };

    const codes = [
      {
        name: 'Division',
        name_sq: 'Ndarje',
        name_sr: 'Division',
      },
      {
        name: 'Drying',
        name_sq: 'Tharje',
        name_sr: 'Drying',
      },
      {
        name: 'Freezing',
        name_sq: 'Ngrirje',
        name_sr: 'Freezing',
      },
      {
        name: 'Pressing',
        name_sq: 'Shtrydhje',
        name_sr: 'Pressing',
      },
      {
        name: 'Grinding',
        name_sq: 'Coptëzim',
        name_sr: 'Grinding',
      },
      {
        name: 'Extraction',
        name_sq: 'Ekstraktim',
        name_sr: 'Extraction',
      },
    ];

    category.codes.push(...codes);

    await dataSource.getRepository(CodeCategory).save(category);
  }
}
