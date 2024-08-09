import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

import { CodeCategory } from '../../modules/code-categories/code-category.entity';
export default class ProcessingMethodsSeeder implements Seeder {
  async run(dataSource: DataSource) {
    const category = {
      api_name: 'PROCESSING_METHODS',
      name: 'Processing Methods',
      name_sq: 'Menyrat e përpunimit',
      name_sr: 'Metode prerade',
      codes: [],
    };

    const codes = [
      {
        name: 'Line',
        name_sq: 'Linjë',
        name_sr: 'Linija',
      },
      {
        name_sq: 'Trakë',
        name_sr: 'Traka',
        name: 'Belt',
      },
    ];

    category.codes.push(...codes);

    await dataSource.getRepository(CodeCategory).save(category);
  }
}
