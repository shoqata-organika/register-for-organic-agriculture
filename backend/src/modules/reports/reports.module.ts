import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { DataSource } from 'typeorm';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { Code } from '../code-categories/code.entity';

@Module({
  imports: [DatabaseModule],
  providers: [
    ReportsService,
    {
      provide: 'CODE_REPOSITORY',
      useFactory: (dataSource: DataSource) => {
        return dataSource.getRepository(Code);
      },
      inject: ['DATA_SOURCE'],
    },
  ],
  controllers: [ReportsController],
})
export class ReportsModule {}
