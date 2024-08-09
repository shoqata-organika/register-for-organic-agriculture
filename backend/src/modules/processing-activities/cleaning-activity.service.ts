import { Repository } from 'typeorm';
import { Member } from '../members/member.entity';
import { Inject } from '@nestjs/common';
import { User } from '../users/user.entity';
import { Language } from '../../localization';
import { CleaningActivity } from './cleaning-activity.entity';
import * as ExcelJS from 'exceljs';
import { CleaningActivityDto } from './cleaning-activity.dto';
import { CleaningActivityXlsxService } from './cleaning-activity-xlsx.service';
import {
  MemberResource,
  ResourceType,
} from '../members/member-resource.entity';

export class CleaningActivityService {
  constructor(
    @Inject('CLEANING_ACTIVITY_REPOSITORY')
    private readonly repo: Repository<CleaningActivity>,

    @Inject('MEMBER_RESOURCE_REPOSITORY')
    private readonly resourceRepo: Repository<MemberResource>,

    @Inject('MEMBER_REPOSITORY')
    private readonly memberRepo: Repository<Member>,

    private readonly xlsxService: CleaningActivityXlsxService,
  ) {}

  async findAll(currentUser: User): Promise<CleaningActivity[]> {
    const cleaningActivities = await this.repo
      .createQueryBuilder('cleaning_activity')
      .innerJoinAndSelect('cleaning_activity.member', 'member')
      .leftJoinAndSelect('cleaning_activity.person', 'person')
      .leftJoinAndSelect('cleaning_activity.processingUnit', 'processingUnit')
      .where('cleaning_activity.member_id = :member_id')
      .orderBy('cleaning_activity.date', 'DESC')
      .setParameter('member_id', currentUser.member_id)
      .getMany();

    return cleaningActivities;
  }

  async findOne(id: number, currentUser: User): Promise<CleaningActivity> {
    const cleaningActivity = this.repo
      .createQueryBuilder('cleaning_activity')
      .innerJoinAndSelect('cleaning_activity.member', 'member')
      .where('cleaning_activity.id = :id', { id })
      .andWhere('cleaning_activity.member_id = :member_id', {
        member_id: currentUser.member_id,
      })
      .getOne();

    return cleaningActivity;
  }

  async create(
    item: CleaningActivityDto,
    currentUser: User,
  ): Promise<CleaningActivity> {
    const member = await this.memberRepo.findOne({
      where: { id: currentUser.member_id },
    });

    const activity = {
      cleaning_tool: item.cleaning_tool,
      cleaned_device: item.cleaned_device,
      reason_of_cleaning: item.reason_of_cleaning,
      date: item.date.toISOString(),
      area: item.area,
      processing_unit_id: item.processing_unit_id,
      notes: item.notes,
      person_id: item.person.id,
      member,
    };

    await this.upsertResource(
      item.person,
      ResourceType.PERSON,
      currentUser.member_id,
    );

    const newItem = await this.repo.create(activity);
    await this.repo.save(newItem);

    return newItem;
  }

  async update(
    id: number,
    item: CleaningActivityDto,
    currentUser: User,
  ): Promise<CleaningActivity> {
    const existing = await this.repo.findOneOrFail({
      where: {
        id,
        member_id: currentUser.member_id,
      },
    });

    const activity = {
      ...existing,
      cleaning_tool: item.cleaning_tool,
      processing_unit_id: item.processing_unit_id,
      date: item.date.toISOString(),
      area: item.area,
      person_id: item.person.id,
    };

    await this.repo.update(id, activity);
    const updatedItem = await this.repo.findOne({ where: { id } });

    return updatedItem;
  }

  async delete(id: number, currentUser: User): Promise<void> {
    await this.repo.findOneOrFail({
      where: {
        id,
        member_id: currentUser.member_id,
      },
    });

    await this.repo.delete({ id, member_id: currentUser.member_id });
  }

  async upsertResource(
    resource: { id: string; name: string },
    resourceType: ResourceType,
    member_id: number,
  ) {
    await this.resourceRepo.upsert(
      {
        id: resource.id,
        name: resource.name,
        member_id: member_id,
        resource_type: resourceType,
      },
      ['id'],
    );
  }

  async exportToExcel(
    user: User,
    lang: Language,
    ids: Array<number>,
  ): Promise<ExcelJS.Buffer> {
    let items = await this.findAll(user);

    items = items.filter((item) => ids.includes(item.id));

    return await this.xlsxService.export(items, lang);
  }
}
