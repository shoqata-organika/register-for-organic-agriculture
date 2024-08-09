import { DataSource } from 'typeorm';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ProcessingUnit } from './processing-unit.entity';
import { ProcessingUnitXlsxService } from './processing-unit-xlsx.service';
import { ProcessingUnitService } from './processing-unit.service';
import { AWSModule } from '../../aws/aws.module';
import { ProcessingUnitController } from './processing-unit.controller';

@Module({
  imports: [DatabaseModule, AWSModule],
  providers: [
    {
      provide: 'PROCESSING_UNIT_REPOSITORY',
      useFactory: (dataSource: DataSource) => {
        return dataSource.getRepository(ProcessingUnit);
      },
      inject: ['DATA_SOURCE'],
    },
    ProcessingUnitService,
    ProcessingUnitXlsxService,
  ],
  controllers: [ProcessingUnitController],
})
export class ProcessingUnitModule {}
