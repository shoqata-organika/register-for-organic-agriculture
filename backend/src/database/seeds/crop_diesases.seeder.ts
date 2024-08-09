import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { CodeCategory } from '../../modules/code-categories/code-category.entity';
export default class CropDiseasesSeeder implements Seeder {
  async run(dataSource: DataSource) {
    const category = {
      api_name: 'CROP_DISEASES',
      name: 'Crop Diseases and Pests',
      name_sq: 'Sëmundjet dhe dëmtuesit e Kulturave',
      name_sr: '',
      codes: [
        {
          name: 'Aphis Ramni',
          name_sq: 'Aphis Ramni',
          name_sr: 'Aphis Ramni',
        },
        {
          name: 'Entyloma Calendulae',
          name_sq: 'Entyloma Calendulae',
          name_sr: 'Entyloma Calendulae',
        },
        {
          name: 'Myzus Persicae',
          name_sq: 'Myzus Persicae',
          name_sr: 'Myzus Persicae',
        },
        {
          name: 'Apion aeneum',
          name_sq: 'Apion aeneum',
          name_sr: 'Apion aeneum',
        },
      ],
    };

    return new Promise(async (resolve) => {
      await dataSource.getRepository(CodeCategory).save(category);
      resolve(null);
    });
  }
}
