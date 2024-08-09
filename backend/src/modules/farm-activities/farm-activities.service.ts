import { Repository, DeepPartial, In } from 'typeorm';
import {
  ActivityType,
  CropProtectionDetails,
  FarmActivity,
  FertilizationDetails,
  GrazingManagementDetails,
  HarvestingDetails,
  PloughingDetails,
  SeedPlantingDetails,
} from '../activities/farm-activity.entity';
import { FarmActivityDto } from './dto';
import * as ExcelJS from 'exceljs';
import { Injectable, Inject } from '@nestjs/common';
import { Language } from '../../localization';
import { User } from '../users/user.entity';
import {
  MemberResource,
  ResourceType,
} from '../members/member-resource.entity';
import { AdmissionService } from '../admissions/admission.service';
import { AWS3 } from '../../aws/aws.service';
import { FarmActivityXlsxService } from './farm-activities-xlsx.service';
import { Admission, AdmissionType } from '../admissions/admission.entity';
import { InventoryItemService } from '../inventory/inventory-item.service';
import { ExpenseService } from '../accounting/expense.service';

@Injectable()
export class FarmActivityService {
  constructor(
    @Inject('FARM_ACTIVITY_REPOSITORY')
    private readonly farmActivityRepo: Repository<FarmActivity>,

    @Inject('MEMBER_RESOURCE_REPOSITORY')
    private readonly resourceRepo: Repository<MemberResource>,

    @Inject('USER_REPOSITORY')
    private readonly userRepo: Repository<User>,

    @Inject(AdmissionService)
    private readonly admissionService: AdmissionService,

    @Inject(InventoryItemService)
    private readonly inventoryItemService: InventoryItemService,

    @Inject(ExpenseService)
    private readonly expenseService: ExpenseService,

    private readonly xlsxService: FarmActivityXlsxService,

    private readonly S3: AWS3,
  ) {}

  async findAll(user: User): Promise<FarmActivityDto[]> {
    const farmActivities = await this.farmActivityRepo
      .createQueryBuilder('farm_activity')
      .leftJoinAndSelect('farm_activity.crop', 'crop')
      .leftJoinAndSelect('farm_activity.partOfCrop', 'partOfCrop')
      .leftJoinAndSelect('farm_activity.landParcel', 'landParcel')
      .where('farm_activity.member_id = :memberId', {
        memberId: user.member_id,
      })
      .orderBy('farm_activity.date', 'DESC')
      .getMany();

    return farmActivities.map((activity) => ({
      id: activity.id,
      date: activity.date,
      activity_type: activity.activity_type,
      landParcel: activity.landParcel,
      crop: activity.crop,
      partOfCrop: activity.partOfCrop,
      file: activity.file,
      quantity: activity.quantity,
      cost: activity.cost,
      time_spent: activity.time_spent,
      comments: activity.comments,
      details: activity.details,
    })) as Partial<FarmActivityDto[]>;
  }

  async create(
    activity: FarmActivityDto,
    user: User,
    file: Express.Multer.File | undefined,
  ): Promise<void> {
    const farmActivity: DeepPartial<FarmActivity> = {
      date: activity.date,
      crop_id: activity.crop_id,
      part_of_crop_id: activity.part_of_crop_id,
      land_parcel_id: activity.land_parcel_id,
      quantity: activity.quantity,
      cost: activity.cost,
      activity_type: activity.activity_type,
      time_spent: activity.time_spent,
      member_id: user.member_id,
      comments: activity.comments,
      details: activity.details,
    };

    if (activity.activity_type === ActivityType.HARVESTING) {
      const year = new Date().getFullYear();

      const admissionNo = await this.admissionService.getNextAdmissionNo(
        user,
        year,
        AdmissionType.HARVESTING,
      );

      const admission: DeepPartial<Admission> = {
        member_id: user.member_id,
        date: activity.date,
        admission_no: admissionNo,
        land_parcel_id: activity.land_parcel_id,
        type: AdmissionType.HARVESTING,
        entries: [
          {
            crop_id: activity.crop_id,
            gross_quantity: activity.quantity,
            net_quantity: activity.quantity,
            part_of_crop_id: activity.part_of_crop_id,
            cropState: activity.cropState,
          },
        ],
      };

      await this.admissionService.create(admission as Admission, user);
    } else {
      if (file) {
        try {
          const response = await this.S3.uploadFile(file);

          if (response) {
            farmActivity.file = response;
          }
        } catch (error) {
          console.error(error);

          throw new Error(error);
        }
      }
    }

    const newActivity = await this.farmActivityRepo.save(farmActivity);
    await this.handleResources(farmActivity, user);
    await this.expenseService.handleFarmActivity(newActivity);

    console.log('activity type: ', activity.activity_type);

    if (activity.activity_type === ActivityType.FERTILIZATION) {
      await this.inventoryItemService.handleFertilization(
        newActivity,
        activity.details as FertilizationDetails,
        user,
      );
    } else if (activity.activity_type === ActivityType.SEED_PLANTING) {
      console.log('activity: ', activity);

      await this.inventoryItemService.handleSeedPlanting(
        newActivity,
        activity.details as SeedPlantingDetails,
        user,
      );
    }
  }

  async update(
    id: number,
    activity: FarmActivityDto,
    user: User,
    file: Express.Multer.File,
  ): Promise<Partial<FarmActivityDto>> {
    const prevActivity = await this.farmActivityRepo.findOneOrFail({
      where: { id, member_id: user.member_id },
    });

    if (!prevActivity) return;

    if (file) {
      try {
        const response = await this.S3.uploadFile(
          file,
          this.S3.getFileName(prevActivity.file),
        );

        if (response) {
          prevActivity.file = response;
        }
      } catch (error) {
        throw new Error(error);
      }
    }

    const result = this.farmActivityRepo.save({
      ...prevActivity,
      date: activity.date,
      crop_id: activity.crop_id,
      part_of_crop_id: activity.part_of_crop_id,
      land_parcel_id: activity.land_parcel_id,
      quantity: activity.quantity,
      cost: activity.cost,
      activity_type: activity.activity_type,
      time_spent: activity.time_spent,
      member_id: user.member_id,
      comments: activity.comments,
      details: activity.details,
    });

    await this.handleResources(activity, user);

    return result;
  }

  async delete(id: number, user: User): Promise<void> {
    const farmActivity = await this.farmActivityRepo
      .createQueryBuilder('farmActivity')
      .where('farmActivity.id = :id', { id })
      .andWhere('farmActivity.member_id = :memberId', {
        memberId: user.member_id,
      })
      .select(['farmActivity.file'])
      .getOneOrFail();

    if (farmActivity.file) {
      try {
        await this.S3.deleteFile(this.S3.getFileName(farmActivity.file));
      } catch (error) {
        throw new Error(error);
      }
    }

    await this.farmActivityRepo.delete({
      member_id: user.member_id,
      id,
    });
  }

  async handleResources(activity: DeepPartial<FarmActivity>, user: User) {
    if (activity.activity_type === ActivityType.LAND_PLOUGHING) {
      const details = activity.details as PloughingDetails;

      this.upsertResources(
        details.devices,
        ResourceType.PLOUGHING_MACHINE,
        user.member_id,
      );
    } else if (activity.activity_type === ActivityType.FERTILIZATION) {
      const details = activity.details as FertilizationDetails;

      this.upsertResources(
        [details.product],
        ResourceType.FERTILIZATION_PRODUCT,
        user.member_id,
      );
      this.upsertResources(
        [details.producer],
        ResourceType.PRODUCER,
        user.member_id,
      );

      this.upsertResources(
        [details.supplier],
        ResourceType.SUPPLIER,
        user.member_id,
      );

      this.upsertResources(
        details.devices,
        ResourceType.FERTILIZATION_MACHINE,
        user.member_id,
      );
    } else if (activity.activity_type === ActivityType.CROP_PROTECTION) {
      const details = activity.details as CropProtectionDetails;

      this.upsertResources(
        [details.product],
        ResourceType.CROP_PROTECTION_PRODUCT,
        user.member_id,
      );

      this.upsertResources(
        [details.supplier],
        ResourceType.SUPPLIER,
        user.member_id,
      );
    } else if (activity.activity_type === ActivityType.GRAZING_MANAGEMENT) {
      const details = activity.details as GrazingManagementDetails;

      this.upsertResources(
        details.devices,
        ResourceType.GRAZING_MACHINE,
        user.member_id,
      );
    } else if (activity.activity_type === ActivityType.SEED_PLANTING) {
      const details = activity.details as SeedPlantingDetails;

      this.upsertResources(
        details.devices,
        ResourceType.SEED_PLANTING_MACHINE,
        user.member_id,
      );
    } else if (activity.activity_type === ActivityType.HARVESTING) {
      const details = activity.details as HarvestingDetails;
      console.log('handleResource: ', activity);

      this.upsertResources(
        details.devices,
        ResourceType.HARVESTING_MACHINE,
        user.member_id,
      );

      this.upsertResources(
        [details.storage_unit],
        ResourceType.STORAGE_UNIT,
        user.member_id,
      );
    }
  }
  async upsertResources(
    resources: { id: string; name: string }[] = [],
    resourceType: ResourceType,
    member_id: number,
  ) {
    await Promise.all(
      (resources || [])
        .filter((r) => r !== null && r !== undefined)
        .map(async (resource) => {
          await this.resourceRepo.upsert(
            {
              id: resource.id,
              name: resource.name,
              member_id: member_id,
              resource_type: resourceType,
            },
            ['id'],
          );
        }),
    );
  }

  async exportToExcel(
    user: User,
    language: Language,
    farmActivityIds: Array<number>,
  ): Promise<ExcelJS.Buffer> {
    const farmActivities = await this.farmActivityRepo
      .createQueryBuilder('farm_activity')
      .leftJoinAndSelect('farm_activity.crop', 'crop')
      .leftJoinAndSelect('farm_activity.partOfCrop', 'partOfCrop')
      .leftJoinAndSelect('farm_activity.landParcel', 'landParcel')
      .where('farm_activity.member_id = :memberId', {
        memberId: user.member_id,
      })
      .andWhere({
        id: In(farmActivityIds),
      })
      .orderBy('farm_activity.date', 'DESC')
      .getMany();

    return this.xlsxService.export(farmActivities, language);
  }
}
