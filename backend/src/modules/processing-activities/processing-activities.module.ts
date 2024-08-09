import { Module } from '@nestjs/common';
import { ProcessingActivityController } from './processing-activities.controller';
import { DatabaseModule } from '../database/database.module';
import { processingActivitiesProviders } from './processing-activities.providers';
import { InventoryModule } from '../inventory/inventory.module';
import { CleaningActivityController } from './cleaning-activity.controller';

@Module({
  providers: processingActivitiesProviders,
  imports: [DatabaseModule, InventoryModule],
  controllers: [ProcessingActivityController, CleaningActivityController],
})
export class ProcessingActivityModule {}
