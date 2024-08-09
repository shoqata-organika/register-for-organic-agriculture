import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Member } from '../../modules/members/member.entity';
import { User } from '../../modules/users/user.entity';
export default class MemberSeeder implements Seeder {
  async run(dataSource: DataSource) {
    const orgs = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21];

    const promises = orgs.map(async (org) => {
      const member = {
        business_name: `Organization ${org}`,
      };

      const newMember = await dataSource.getRepository(Member).save(member);

      const user = dataSource.getRepository(User).create({
        username: `user${org}`,
        first_name: `User ${org}`,
        password: 'test',
        member: newMember,
      });

      return dataSource.getRepository(User).save(user);
    });

    return Promise.all(promises);
  }
}
