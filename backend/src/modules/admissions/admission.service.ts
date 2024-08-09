import { Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Admission, AdmissionType } from './admission.entity';
import { User } from '../users/user.entity';
import { Language } from '../../localization';
import { Zone } from '../members/zone.entity';
import * as ExcelJS from 'exceljs';
import { Harvester } from '../members/harvester.entity';
import { AdmissionXlsxService } from './admission-xlsx.service';
import { ContractedFarmer } from '../contracted_farmers/contracted-farmer.entity';
import { InventoryItemService } from '../inventory/inventory-item.service';

export class AdmissionService {
  constructor(
    @Inject('ADMISSION_REPOSITORY')
    private readonly admissionRepo: Repository<Admission>,

    @Inject('ZONE_REPOSITORY')
    private readonly zoneRepo: Repository<Zone>,

    @Inject('HARVESTER_REPOSITORY')
    private readonly harvesterRepo: Repository<Harvester>,

    @Inject('CONTRACTED_FARMER_REPOSITORY')
    private readonly contractedFarmersRepo: Repository<ContractedFarmer>,

    @Inject(InventoryItemService)
    private readonly inventoryItemService: InventoryItemService,

    private readonly xlsxService: AdmissionXlsxService,
  ) {}

  async findAll(currentUser: User, type?: string): Promise<Admission[]> {
    let query = this.admissionRepo
      .createQueryBuilder('admission')
      .innerJoinAndSelect('admission.entries', 'entries')
      .leftJoinAndSelect('entries.crop', 'crop')
      .leftJoinAndSelect('entries.partOfCrop', 'partOfCrop')
      .leftJoinAndSelect('admission.contractedFarmer', 'contractedFarmer')
      .leftJoinAndSelect('admission.harvester', 'harvester')
      .leftJoinAndSelect('admission.zone', 'zone')
      .leftJoinAndSelect('admission.landParcel', 'landParcel')
      .where('admission.member_id = :member_id', {
        member_id: currentUser.member_id,
      })
      .orderBy('admission.id', 'DESC');

    if (type) {
      query = query.andWhere({ type: type });
    }
    const admissions = await query.getMany();

    return admissions;
  }

  async findOne(id: number, currentUser: User): Promise<Admission> {
    const admission = this.admissionRepo
      .createQueryBuilder('admission')
      .leftJoinAndSelect('admission.harvester', 'harvester')
      .leftJoinAndSelect('admission.contractedFarmer', 'contractedFarmer')
      .leftJoinAndSelect('admission.landParcel', 'landParcel')
      .leftJoinAndSelect('admission.zone', 'zone')
      .leftJoinAndSelect('admission.entries', 'entries')
      .leftJoinAndSelect('entries.crop', 'crop')
      .leftJoinAndSelect('entries.partOfCrop', 'partOfCrop')
      .where('admission.id = :id', { id })
      .andWhere('admission.member_id = :member_id', {
        member_id: currentUser.member_id,
      })
      .getOne();

    return admission;
  }

  async create(data: Admission, currentUser: User): Promise<Admission> {
    const year = new Date().getFullYear();

    const nextAdmissionNo = await this.getNextAdmissionNo(
      currentUser,
      year,
      data.type,
    );

    data.admission_no = nextAdmissionNo;

    this.assignRelations(data, currentUser);

    data.member_id = currentUser.member_id;

    const result = await this.admissionRepo.save(data);

    const newAdmission = await this.admissionRepo.findOneOrFail({
      where: { id: result.id },
      relations: ['entries', 'entries.admission'],
    });

    await this.inventoryItemService.handleAdmissionItems(
      newAdmission,
      currentUser,
    );

    return result;
  }

  async getNextAdmissionNo(
    currentUser: User,
    year: number,
    type: AdmissionType,
  ): Promise<string> {
    const admission = await this.admissionRepo.findOne({
      where: { member_id: currentUser.member_id },
      order: { id: 'DESC' },
    });

    const prefix = type === AdmissionType.COLLECTION ? 'G' : 'K';

    if (!admission) {
      return `${prefix}/${1}/${year}`;
    }

    // type, count, year
    const [_, seq, admissionYear] = admission.admission_no.split('/');

    if (Number(admissionYear) !== year) {
      return `${prefix}/${1}/${year}`;
    }

    return `${prefix}/${Number(seq) + 1}/${year}`;
  }

  private async assignRelations(data: Admission, currentUser: User) {
    if (data.contracted_farmer_id) {
      const contractedFarmer = await this.contractedFarmersRepo.findOneOrFail({
        where: {
          id: data.contracted_farmer_id,
          member: { id: currentUser.member_id },
        },
      });

      data.contracted_farmer_id = contractedFarmer.id;
    }

    if (data.zone_id) {
      const zone = await this.zoneRepo.findOneOrFail({
        where: {
          id: data.zone_id,
          member: { id: currentUser.member_id },
        },
      });

      data.zone_id = zone.id;
    }

    if (data.harvester_id) {
      const harvester = await this.harvesterRepo.findOneOrFail({
        where: {
          id: data.harvester_id,
          member: { id: currentUser.member_id },
        },
      });

      data.harvester_id = harvester.id;
    }
  }

  async exportToExcel(
    user: User,
    type: string,
    language: Language,
    admissionIds: Array<number>,
  ): Promise<ExcelJS.Buffer> {
    let admissions = await this.findAll(user, type);

    admissions = admissions.filter((admission) =>
      admissionIds.includes(admission.id),
    );

    return await this.xlsxService.export(admissions, type, language);
  }
}
