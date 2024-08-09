import { Repository } from 'typeorm';
import { Injectable, Inject } from '@nestjs/common';
import { Member, APPROVAL_STATUS } from '../members/member.entity';

@Injectable()
export class AdminService {
  constructor(
    @Inject('MEMBER_REPOSITORY')
    private readonly memberRepo: Repository<Member>,
  ) {}

  async getAllMembers(): Promise<any[]> {
    const members = await this.memberRepo.find();

    return members;
  }

  async updateMember(status: APPROVAL_STATUS, id: number): Promise<any> {
    const member = await this.memberRepo.findOneOrFail({
      where: {
        id,
      },
    });

    if (status === APPROVAL_STATUS.APPROVED && member.approved_at === null) {
      member.approved_at = new Date();
    }

    return await this.memberRepo.save({
      ...member,
      approval_status: status,
    });
  }
}
