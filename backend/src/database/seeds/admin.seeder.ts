import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { User } from '../../modules/users/user.entity';
export default class AdminSeeder implements Seeder {
  async run(dataSource: DataSource) {
    const user = await dataSource.getRepository(User).create({
      username: `admin`,
      first_name: `Administrator`,
      roles: ['admin'],
      password: 'adm123',
    });

    await dataSource.getRepository(User).save(user);
  }
}
