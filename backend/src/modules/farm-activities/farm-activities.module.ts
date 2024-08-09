import { DatabaseModule } from '../database/database.module';
import { FarmActivityController } from './farm-activities.controller';
import { Module } from '@nestjs/common';
import { farmActivityProviders } from './farm-activities.providers';
import { AWSModule } from '../../aws/aws.module';
import { CodeCategoryModule } from '../code-categories/code-category.module';
import { AdmissionModule } from '../admissions/admission.module';
import { InventoryModule } from '../inventory/inventory.module';
import { AccountingModule } from '../accounting/accounting.module';

@Module({
  providers: farmActivityProviders,
  imports: [
    DatabaseModule,
    AdmissionModule,
    AWSModule,
    CodeCategoryModule,
    InventoryModule,
    AccountingModule,
  ],
  controllers: [FarmActivityController],
})
export class FarmActivityModule {}
