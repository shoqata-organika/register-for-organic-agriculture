import { DeepPartial, Repository } from 'typeorm';
import { Member } from '../members/member.entity';
import { Inject } from '@nestjs/common';
import { User } from '../users/user.entity';
import * as ExcelJS from 'exceljs';
import { InventoryLocation } from './inventory-location.entity';
import { Language } from '../../localization';
import { InventoryLocationXlsxService } from './inventory-location-xlsx.service';

export class InventoryLocationService {
  constructor(
    @Inject('INVENTORY_LOCATION_REPOSITORY')
    private readonly repo: Repository<InventoryLocation>,

    @Inject('MEMBER_REPOSITORY')
    private readonly memberRepo: Repository<Member>,
    private readonly xlsxService: InventoryLocationXlsxService,
  ) {}

  async findAll(currentUser: User): Promise<InventoryLocation[]> {
    const locations = await this.repo
      .createQueryBuilder('inventory_location')
      .innerJoinAndSelect('inventory_location.member', 'member')
      .where('inventory_location.member_id = :member_id')
      .setParameter('member_id', currentUser.member_id)
      .getMany();

    return locations;
  }

  async findOne(id: number, currentUser: User): Promise<InventoryLocation> {
    const location = this.repo
      .createQueryBuilder('inventory_location')
      .innerJoinAndSelect('inventory_location.member', 'member')
      .where('inventory_location.id = :id', { id })
      .andWhere('inventory_location.member_id = :member_id', {
        member_id: currentUser.member_id,
      })
      .getOne();

    return location;
  }

  async create(
    location: DeepPartial<InventoryLocation>,
    currentUser: User,
  ): Promise<InventoryLocation> {
    const member = await this.memberRepo.findOne({
      where: { id: currentUser.member_id },
    });
    location.member = member;

    const newLocation = await this.repo.create(location);
    await this.repo.save(newLocation);

    return newLocation;
  }

  async update(
    id: number,
    location: DeepPartial<InventoryLocation>,
    currentUser: User,
  ): Promise<InventoryLocation> {
    await this.repo.findOneOrFail({
      where: {
        id,
        member_id: currentUser.member_id,
      },
    });

    await this.repo.update(id, location);
    const updatedLocation = await this.repo.findOne({ where: { id } });

    return updatedLocation;
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

  async exportToExcel(user: User, language: Language): Promise<ExcelJS.Buffer> {
    const items = await this.findAll(user);

    return await this.xlsxService.export(items, language);
  }
}
