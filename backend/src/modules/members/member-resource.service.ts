import { DeepPartial, In, Repository } from 'typeorm';
import { Member } from '../members/member.entity';
import { Inject } from '@nestjs/common';
import { User } from '../users/user.entity';
import { MemberResource } from './member-resource.entity';

export class MemberResourceService {
  constructor(
    @Inject('MEMBER_RESOURCE_REPOSITORY')
    private readonly repo: Repository<MemberResource>,

    @Inject('MEMBER_REPOSITORY')
    private readonly memberRepo: Repository<Member>,
  ) {}

  async findAll(
    currentUser: User,
    resourceTypes: string[],
  ): Promise<MemberResource[]> {
    const resources = await this.repo
      .createQueryBuilder('member_resource')
      .innerJoinAndSelect('member_resource.member', 'member')
      .where('member_resource.member_id = :member_id')
      .andWhere({
        resource_type: In(resourceTypes),
      })
      .setParameter('member_id', currentUser.member_id)
      .getMany();

    return resources;
  }

  async findOne(id: number, currentUser: User): Promise<MemberResource> {
    const resource = this.repo
      .createQueryBuilder('member_resource')
      .innerJoinAndSelect('member_resource.member', 'member')
      .where('expense.id = :id', { id })
      .andWhere('member_resource.member_id = :member_id', {
        member_id: currentUser.member_id,
      })
      .getOne();

    return resource;
  }

  async create(
    resource: DeepPartial<MemberResource>,
    currentUser: User,
  ): Promise<MemberResource> {
    const member = await this.memberRepo.findOne({
      where: { id: currentUser.member_id },
    });
    resource.member = member;

    const newResource = await this.repo.create(resource);
    await this.repo.save(newResource);

    return newResource;
  }

  async update(
    id: string,
    resource: DeepPartial<MemberResource>,
    currentUser: User,
  ): Promise<MemberResource> {
    await this.repo.findOneOrFail({
      where: {
        id,
        member_id: currentUser.member_id,
      },
    });

    await this.repo.update(id, resource);
    const updatedResource = await this.repo.findOne({ where: { id } });

    return updatedResource;
  }

  async delete(id: string, currentUser: User): Promise<void> {
    await this.repo.findOneOrFail({
      where: {
        id,
        member_id: currentUser.member_id,
      },
    });

    await this.repo.delete({ id, member_id: currentUser.member_id });
  }
}
