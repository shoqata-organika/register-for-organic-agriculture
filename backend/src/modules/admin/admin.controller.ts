import { Controller, Get, Post, Query } from '@nestjs/common';
import { Member, APPROVAL_STATUS } from '../members/member.entity';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly service: AdminService) {}

  @Get('/members')
  async getAllMembers(): Promise<Member[]> {
    return await this.service.getAllMembers();
  }

  @Post('/members')
  async updateMember(
    @Query('status') status: APPROVAL_STATUS,
    @Query('id') id: number,
  ): Promise<void> {
    return await this.service.updateMember(status, id);
  }
}
