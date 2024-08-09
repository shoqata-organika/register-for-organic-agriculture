import { DataSource } from 'typeorm';
import { ProcessingActivity } from '../activities/processing-activity.entity';
import { ProcessingActivityService } from './processing-activities.service';
import { Admission } from '../admissions/admission.entity';
import { CleaningActivity } from './cleaning-activity.entity';
import { InventoryItem } from '../inventory/inventory-item.entity';
import { ProcessingActivitiesXlsxService } from './processing-activities-xlsx.service';
import { CleaningActivityXlsxService } from './cleaning-activity-xlsx.service';
import { MemberResource } from '../members/member-resource.entity';
import { CleaningActivityService } from './cleaning-activity.service';
import { Member } from '../members/member.entity';

export const processingActivitiesProviders = [
  {
    provide: 'PROCESSING_ACTIVITY_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ProcessingActivity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'ADMISSION_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Admission),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'INVENTORY_ITEM_REPOSITORY',
    useFactory: (dataSource: DataSource) => {
      return dataSource.getRepository(InventoryItem);
    },
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'CLEANING_ACTIVITY_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(CleaningActivity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'MEMBER_RESOURCE_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(MemberResource),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'MEMBER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Member),
    inject: ['DATA_SOURCE'],
  },
  ProcessingActivityService,
  CleaningActivityService,
  CleaningActivityXlsxService,
  ProcessingActivitiesXlsxService,
];
