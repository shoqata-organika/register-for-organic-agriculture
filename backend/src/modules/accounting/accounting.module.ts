import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { accountingProviders } from './accounting.providers';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { SaleController } from './sale.controller';
import { SaleXlsxService } from './sale-xlsx.service';
import { SaleService } from './sale.service';
import { InventoryModule } from '../inventory/inventory.module';

@Module({
  imports: [DatabaseModule, InventoryModule],
  providers: [
    ...accountingProviders,
    ExpenseService,
    SaleService,
    SaleXlsxService,
  ],
  controllers: [ExpenseController, SaleController],
  exports: [ExpenseService],
})
export class AccountingModule {}
