import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { DataSource } from 'typeorm';
import { InventoryLocationService } from './inventory-location.service';
import { InventoryLocation } from './inventory-location.entity';
import { InventoryLocationController } from './inventory-location.controller';
import { Member } from '../members/member.entity';
import { InventoryItem } from './inventory-item.entity';
import { InventoryItemController } from './inventory-item.controller';
import { InventoryItemService } from './inventory-item.service';
import { MemberResource } from '../members/member-resource.entity';
import { InventoryItemXlsxService } from './inventory-item-xlsx.service';
import { InventoryLocationXlsxService } from './inventory-location-xlsx.service';
import { FarmActivity } from '../activities/farm-activity.entity';
import { ProcessingActivity } from '../activities/processing-activity.entity';
import { AdmissionEntry } from '../admissions/admission-entry.entity';

@Module({
  imports: [DatabaseModule],
  providers: [
    InventoryLocationService,
    InventoryItemService,
    InventoryItemXlsxService,
    InventoryLocationXlsxService,
    {
      provide: 'INVENTORY_LOCATION_REPOSITORY',
      useFactory: (dataSource: DataSource) => {
        return dataSource.getRepository(InventoryLocation);
      },
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
      provide: 'MEMBER_REPOSITORY',
      useFactory: (dataSource: DataSource) => {
        return dataSource.getRepository(Member);
      },
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'MEMBER_RESOURCE_REPOSITORY',
      useFactory: (dataSource: DataSource) => {
        return dataSource.getRepository(MemberResource);
      },
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'FARM_ACTIVITY_REPOSITORY',
      useFactory: (dataSource: DataSource) => {
        return dataSource.getRepository(FarmActivity);
      },
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'ADMISSION_ENTRY_REPOSITORY',
      useFactory: (dataSource: DataSource) => {
        return dataSource.getRepository(AdmissionEntry);
      },
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'PROCESSING_ACTIVITY_REPOSITORY',
      useFactory: (dataSource: DataSource) => {
        return dataSource.getRepository(ProcessingActivity);
      },
      inject: ['DATA_SOURCE'],
    },
  ],
  controllers: [InventoryLocationController, InventoryItemController],
  exports: [InventoryItemService],
})
export class InventoryModule {}
