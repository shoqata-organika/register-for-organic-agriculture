import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

import * as fs from 'fs';
import { parse } from 'csv';
import { CodeCategory } from '../../modules/code-categories/code-category.entity';
import { Member } from '../../modules/members/member.entity';
import { User } from '../../modules/users/user.entity';
export default class ActivitiesSeeder implements Seeder {
  async run(dataSource: DataSource) {
    // read activities from activities.csv
    const parser = parse(fs.readFileSync(__dirname + '/activities.csv'), {
      columns: true,
    });

    const category = {
      api_name: 'CULTIVATION_ACTIVITIES',
      name: 'Cultivation Activities',
      name_sq: 'Aktivitetet e kultivimit',
      name_sr: 'Aktivnosti uzgoja',
      codes: [],
    };

    const codes = [];

    parser.on('readable', () => {
      let record;

      while ((record = parser.read()) !== null) {
        codes.push(record);
      }
    });

    return new Promise((resolve) => {
      parser.on('end', async () => {
        category.codes.push(...codes);

        await dataSource.getRepository(CodeCategory).save(category);

        const member = {
          business_name: 'TestORG',
        };

        const newMember = await dataSource.getRepository(Member).save(member);
        const user = dataSource.getRepository(User).create({
          username: 'test',
          password: 'test',
          member: newMember,
        });

        await dataSource.getRepository(User).save(user);
        resolve(null);
      });
    });
  }
}
