import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Brackets, Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  async findAllForMember(member_id: number): Promise<User[]> {
    return await this.userRepository.find({
      where: { member_id: member_id },
      relations: ['member'],
    });
  }

  async exists(
    username: string,
    email: string,
    userId?: number,
  ): Promise<boolean> {
    console.log('querying for username and email', username, email);

    let users = await this.userRepository.createQueryBuilder('user').where(
      new Brackets((qb) => {
        qb.where('user.username = :username', { username: username });
        qb.orWhere('user.email = :email', { email: email });
      }),
    );

    if (userId) {
      users = users.andWhere('user.id != :id', {
        id: userId,
      });
    }

    const totalUsers = await users.getCount();
    return totalUsers > 0;
  }

  async create(user: User, member_id: number): Promise<User> {
    if (await this.exists(user.username, user.email)) {
      throw new BadRequestException('Username or email already exists');
    }

    user.member_id = member_id;

    return await this.userRepository.save(user);
  }

  async update(user: User, member_id: number): Promise<User> {
    if (await this.exists(user.username, user.email, user.id)) {
      throw new BadRequestException('Username or email already exists');
    }

    user.member_id = member_id;

    // do not update password if it is not provided
    if (!user.password) {
      delete user.password;
    }

    return await this.userRepository.save(user);
  }

  async delete(id: number, member_id: number): Promise<void> {
    await this.userRepository.delete({ id: id, member_id: member_id });
  }

  async getUser(id: number): Promise<User> {
    return await this.userRepository.findOne({
      where: { id: id },
      relations: ['member'],
    });
  }

  async findOne(username: string) {
    const user = this.userRepository
      .createQueryBuilder('user')
      .where(`LOWER(user.username) = LOWER(:username)`, {
        username,
      })
      .select([
        'user.id',
        'user.username',
        'user.password',
        'user.member_id',
        'user.roles',
      ])
      .getOne();

    return user;
  }

  async getZones(userId: number) {
    const users = await this.userRepository.find({
      where: { id: userId },
      relations: ['member', 'member.zones'],
    });

    return users[0].member.zones;
  }

  async getLandParcels(userId: number) {
    const users = await this.userRepository.find({
      where: { id: userId },
      relations: ['member', 'member.landParcels'],
    });

    return users[0].member.landParcels;
  }

  async getHarvesters(userId: number) {
    const users = await this.userRepository.find({
      where: { id: userId },
      relations: ['member', 'member.harvesters', 'member.harvesters.zone'],
    });

    return users[0].member.harvesters;
  }

  async getResources(userId: number, resource_type?: string) {
    let condition = { id: userId, member: null };

    if (resource_type) {
      condition = {
        ...condition,
        member: {
          resources: {
            resource_type: resource_type,
          },
        },
      };
    }

    const users = await this.userRepository.find({
      where: condition,
      relations: ['member', 'member.resources'],
    });

    return users[0] ? users[0].member.resources : [];
  }
}
