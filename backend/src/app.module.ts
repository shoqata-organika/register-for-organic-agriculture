import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { CodeCategoryModule } from './modules/code-categories/code-category.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AdmissionModule } from './modules/admissions/admission.module';
import { FarmActivityModule } from './modules/farm-activities/farm-activities.module';
import { ProcessingActivityModule } from './modules/processing-activities/processing-activities.module';
import { ProcessingUnitModule } from './modules/processing-units/processing-unit.module';
import { ContractedFarmerModule } from './modules/contracted_farmers/contracted-farmer.module';
import { MemberModule } from './modules/members/member.module';
import { AccountingModule } from './modules/accounting/accounting.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { AdminModule } from './modules/admin/admin.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { ReportsModule } from './modules/reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    AdminModule,
    InventoryModule,
    CodeCategoryModule,
    AuthModule,
    UsersModule,
    AdmissionModule,
    FarmActivityModule,
    ProcessingActivityModule,
    AccountingModule,
    ProcessingUnitModule,
    ContractedFarmerModule,
    MemberModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
