import { DataSource } from 'typeorm';
import { FarmActivityService } from './farm-activities.service';
import { FarmActivityXlsxService } from './farm-activities-xlsx.service';
import { FarmActivity } from '../activities/farm-activity.entity';
import { MemberResource } from '../members/member-resource.entity';
import { User } from '../users/user.entity';
import { Admission } from '../admissions/admission.entity';
import { Zone } from '../members/zone.entity';
import { Harvester } from '../members/harvester.entity';
import { ContractedFarmer } from '../contracted_farmers/contracted-farmer.entity';

export const farmActivityProviders = [
  {
    provide: 'FARM_ACTIVITY_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(FarmActivity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'MEMBER_RESOURCE_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(MemberResource),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'USER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'ADMISSION_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Admission),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'ZONE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Zone),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'HARVESTER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Harvester),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'CONTRACTED_FARMER_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ContractedFarmer),
    inject: ['DATA_SOURCE'],
  },
  FarmActivityService,
  FarmActivityXlsxService,
];
