import { Injectable, Inject } from '@nestjs/common';
import { Repository, Not } from 'typeorm';
import {
  StoreProcessingActivityDto,
  ProcessingActivityDto,
  NewProcessingActivityEntryDto,
} from './dto';
import { User } from '../users/user.entity';
import { Language } from '../../localization';
import { ProcessingActivityEntry } from '../activities/processing-activity-entry.entity';
import {
  ProcessingActivity,
  ProcessingType,
} from '../activities/processing-activity.entity';
import * as ExcelJS from 'exceljs';
import { Admission } from '../admissions/admission.entity';
import { ProcessingActivitiesXlsxService } from './processing-activities-xlsx.service';
import { InventoryItem } from '../inventory/inventory-item.entity';
import { InventoryItemService } from '../inventory/inventory-item.service';

@Injectable()
export class ProcessingActivityService {
  constructor(
    @Inject('PROCESSING_ACTIVITY_REPOSITORY')
    private readonly processingActivityRepo: Repository<ProcessingActivity>,

    @Inject('ADMISSION_REPOSITORY')
    private readonly admissionRepo: Repository<Admission>,

    @Inject('INVENTORY_ITEM_REPOSITORY')
    private readonly inventoryItemRepo: Repository<InventoryItem>,

    @Inject(InventoryItemService)
    private readonly inventoryItemService: InventoryItemService,

    private readonly xlsxService: ProcessingActivitiesXlsxService,
  ) {}

  async delete(id: number, user: User): Promise<void> {
    this.processingActivityRepo
      .createQueryBuilder()
      .delete()
      .from(ProcessingActivity)
      .where('id = :id', { id })
      .where('member_id = :member_id', { member_id: user.member_id })
      .execute();
  }

  async create(
    activity: NewProcessingActivityEntryDto,
    user: User,
    type?: ProcessingType,
  ): Promise<any> {
    const newActivity: Partial<ProcessingActivity> = {
      date: activity.date,
      member_id: user.member_id,
      processing_method_id: activity.processing_method_id,
      processingType: activity.processing_type,
      processing_unit_id: +activity.processing_unit_id,
      drier_number: activity.drier_number,
      drier_temp: activity.drier_temp,
      drier_start_hour: activity.drier_start_hour,
      drier_end_hour: activity.drier_end_hour,
      drying_start_date: activity.drying_start_date,
      drying_end_date: activity.drying_end_date,
      lotCode: activity.lot_code,
      notes: activity.notes,
      entries: activity.entries.map((entry) => ({
        grossQuantity: entry.gross_quantity,
        netQuantity: entry.net_quantity,
        cropStatus: entry.cropStatus,
        cropState: entry.cropState,
        crop_id: +entry.crop_id,
        part_of_crop_id: +entry.part_of_crop_id,
        inventory_item_id: entry.inventory_item_id,
        firo: +entry.firo,
        fraction: entry.fraction,
      })) as ProcessingActivityEntry[],
    };

    const result: ProcessingActivity =
      await this.processingActivityRepo.save(newActivity);

    const processingActivity = await this.find(user, type)
      .andWhere({ id: result.id })
      .getOne();

    await this.inventoryItemService.handleProcessedItems(
      processingActivity,
      user,
    );

    return result;
  }

  async update(
    id: number,
    activity: StoreProcessingActivityDto,
    user: User,
  ): Promise<ProcessingActivity> {
    const processingActivity = await this.processingActivityRepo
      .createQueryBuilder('processing_activity')
      .where('processing_activity.id = :id', { id })
      .where('processing_activity.member_id = :member_id', {
        member_id: user.member_id,
      })
      .getOneOrFail();

    const admission = await this.admissionRepo
      .createQueryBuilder('admission')
      .where('admission.id = :id', { id: activity.admission_id })
      .innerJoinAndSelect('admission.entries', 'entries')
      .getOneOrFail();

    const admissionEntry = admission.entries.find(
      (actvt) => actvt.id === activity.admission_entry_id,
    );

    if (!admissionEntry) {
      throw new Error('Admission entry not found');
    }

    const updatedActivity = {
      id: processingActivity.id,
      date: activity.date,
      admission_id: activity.admission_id,
      crop_id: admissionEntry.crop_id,
      part_of_crop_id: admissionEntry.part_of_crop_id,
      grossQuantity: activity.gross_quantity,
      netQuantity: activity.net_quantity,
      firo: activity.firo,
      notes: activity.notes,
      lotCode: activity.lot_code,
      processing_method_id: activity.processing_method_id,
      processing_type_id: activity.processing_type_id,
      processing_unit_id: activity.processing_unit_id,
    } as Partial<ProcessingActivity>;

    return this.processingActivityRepo.save(updatedActivity);
  }

  async findAll(
    user: User,
    type?: ProcessingType,
  ): Promise<ProcessingActivityDto[]> {
    const results = await this.find(user, type)
      .orderBy('processing_activity.date', 'DESC')
      .getMany();

    return results
      .map((activity) => {
        return activity.entries.map((entry) => ({
          id: activity.id,
          admission_no:
            entry.inventoryItem.admissionEntry.admission.admission_no,
          admission_id: entry.inventoryItem.admissionEntry.admission.id,
          admissionEntry: entry.inventoryItem.admissionEntry,
          admission_entry_id: entry.inventoryItem.admissionEntry.id,
          crop: entry.crop,
          partOfCrop: entry.partOfCrop,
          processing_method: activity.processingMethod,
          processing_type: activity.processingType,
          processing_unit: activity.processingUnit,
          date: activity.date,
          crop_state: entry.cropState,
          crop_status: entry.cropStatus,
          gross_quantity: entry.grossQuantity,
          net_quantity: entry.netQuantity,
          firo: entry.firo,
          notes: activity.notes,
          drier_number: activity.drier_number,
          drier_temp: activity.drier_temp,
          drying_start_date: activity.drying_start_date,
          drying_end_date: activity.drying_end_date,
          drier_start_hour: activity.drier_start_hour,
          drier_end_hour: activity.drier_end_hour,
          lot_code: activity.lotCode,
          type: entry.inventoryItem.type,
          zone: entry.inventoryItem.admissionEntry.admission.zone,
        }));
      })
      .flat();
  }

  private find(user: User, type?: ProcessingType) {
    const query = this.processingActivityRepo
      .createQueryBuilder('processing_activity')
      .innerJoinAndSelect('processing_activity.entries', 'entries')
      .innerJoinAndSelect('entries.inventoryItem', 'inventoryItem')
      .innerJoinAndSelect('inventoryItem.operations', 'operations')
      .innerJoinAndSelect('inventoryItem.admissionEntry', 'admissionEntry')
      .innerJoinAndSelect('admissionEntry.admission', 'admission')
      .leftJoinAndSelect('admission.zone', 'zone')
      .leftJoinAndSelect('admission.harvester', 'harvester')
      .leftJoinAndSelect('entries.crop', 'crop')
      .leftJoinAndSelect('entries.partOfCrop', 'part_of_crop')
      .leftJoinAndSelect(
        'processing_activity.processingMethod',
        'processing_method',
      )
      .leftJoinAndSelect(
        'processing_activity.processingUnit',
        'processing_unit',
      )
      .where('processing_activity.member_id = :member_id', {
        member_id: user.member_id,
      });

    if (type && type.trim() === ProcessingType.DRYING) {
      query.andWhere({ processingType: ProcessingType.DRYING });
    } else {
      query.andWhere({
        processingType: Not(ProcessingType.DRYING),
      });
    }

    return query;
  }

  async exportToExcel(
    user: User,
    language: Language,
    ids: Array<number>,
    type?: ProcessingType,
  ): Promise<ExcelJS.Buffer> {
    let items = await this.findAll(user, type);

    items = items.filter((item) => ids.includes(item.id));

    return await this.xlsxService.export(items, type, language);
  }
}
