import { DataSource } from 'typeorm';
import { ContractedFarmer } from './contracted-farmer.entity';
import { DatabaseModule } from '../database/database.module';
import { ContractedFarmerService } from './contracted-farmer.service';
import { ContractedFarmerController } from './contracted-farmer.controller';
import { ContractedFarmerXlsxService } from './contracted-farmer-xlsx.service';
import { AWSModule } from '../../aws/aws.module';
import { Module } from '@nestjs/common';
import { LandParcel } from '../land-parcels/land-parcel.entity';

@Module({
  imports: [DatabaseModule, AWSModule],
  providers: [
    ContractedFarmerService,
    ContractedFarmerXlsxService,
    {
      provide: 'CONTRACTED_FARMERS_REPOSITORY',
      useFactory: (dataSource: DataSource) => {
        return dataSource.getRepository(ContractedFarmer);
      },
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'LAND_PARCEL_REPOSITORY',
      useFactory: (dataSource: DataSource) => {
        return dataSource.getRepository(LandParcel);
      },
      inject: ['DATA_SOURCE'],
    },
  ],
  controllers: [ContractedFarmerController],
})
export class ContractedFarmerModule {}
