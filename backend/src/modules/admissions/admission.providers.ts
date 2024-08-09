import { DataSource } from 'typeorm';
import { Admission } from './admission.entity';
import { Zone } from '../members/zone.entity';
import { Harvester } from '../members/harvester.entity';
import { User } from '../users/user.entity';
import { ContractedFarmer } from '../contracted_farmers/contracted-farmer.entity';

export const admissionProviders = [
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
  {
    provide: 'USER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: ['DATA_SOURCE'],
  },
];
