import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { admissionProviders } from './admission.providers';
import { AdmissionService } from './admission.service';
import { AdmissionController } from './admission.controller';
import { AdmissionXlsxService } from './admission-xlsx.service';
import { InventoryModule } from '../inventory/inventory.module';

@Module({
  imports: [DatabaseModule, InventoryModule],
  providers: [...admissionProviders, AdmissionService, AdmissionXlsxService],
  controllers: [AdmissionController],
  exports: [AdmissionService],
})
export class AdmissionModule {}
