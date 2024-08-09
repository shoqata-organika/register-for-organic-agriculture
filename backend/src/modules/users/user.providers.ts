import { DataSource } from 'typeorm';
import { User } from './user.entity';
import { Harvester } from '../members/harvester.entity';
import { Zone } from '../members/zone.entity';
import { LandParcel } from '../land-parcels/land-parcel.entity';
import { LandParcelCrop } from '../land-parcels/land-parcel-crop.entity';
import { SubParcel } from '../land-parcels/subparcel.entity';

export const userProviders = [
  {
    provide: 'USER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'HARVESTER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Harvester),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'ZONE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Zone),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'LAND_PARCEL_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(LandParcel),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'LAND_PARCEL_CROP_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(LandParcelCrop),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'SUB_PARCEL_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(SubParcel),
    inject: ['DATA_SOURCE'],
  },
];
