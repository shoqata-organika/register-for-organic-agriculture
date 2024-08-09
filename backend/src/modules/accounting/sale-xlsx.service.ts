import { Injectable } from '@nestjs/common';
import { Xlsx } from '../../abstracts/xlsx';
import { Sale } from './sale.entity';
import { Language } from '../../localization';
import * as ExcelJS from 'exceljs';
import { formatMoney } from '../../utils/formatmoney';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const format = require('date-fns/format');

@Injectable()
export class SaleXlsxService extends Xlsx<Sale> {
  constructor() {
    super();
  }

  async export(items: Sale[], language: Language = 'sq') {
    const { t } = this.translations(language);
    const title = t('Sales');
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(title);

    // Set column widths. Adjust these as needed.
    worksheet.columns = [
      { key: 'A', width: 5 },
      { key: 'B', width: 15 },
      { key: 'C', width: 20 },
      { key: 'D', width: 15 },
      { key: 'E', width: 15 },
      { key: 'F', width: 10 },
      { key: 'G', width: 10 },
      { key: 'H', width: 15 },
      { key: 'I', width: 15 },
      { key: 'J', width: 10 },
      { key: 'K', width: 10 },
      { key: 'L', width: 10 },
      { key: 'M', width: 10 },
      { key: 'N', width: 10 },
      { key: 'O', width: 10 },
      { key: 'P', width: 15 },
      { key: 'Q', width: 15 },
      { key: 'R', width: 15 },
      { key: 'S', width: 15 },
      { key: 'T', width: 10 },
      { key: 'U', width: 10 },
      { key: 'V', width: 10 },
      { key: 'W', width: 10 },
      { key: 'X', width: 10 },
      { key: 'Y', width: 10 },
    ];
    // Merge cells for the top header row
    worksheet.mergeCells('B2:Y2');
    worksheet.getCell('B2').value = title;

    this.setAlignment(worksheet);

    this.addBorder(worksheet, 8, 'B', 'H');
    this.addBgColor(worksheet, 8, 'F', 'G', 'FFD9D9D9');
    this.setBold(worksheet, 8);

    this.setBold(worksheet, 6);

    worksheet.mergeCells('B4:B8');
    worksheet.getCell('B4').value = t('Date');

    worksheet.mergeCells('C4:C8');
    worksheet.getCell('C4').value = t('Customer');

    worksheet.mergeCells('D4:D8');
    worksheet.getCell('D4').value = t('Sale Type');

    worksheet.mergeCells('E4:F8');
    worksheet.getCell('E4').value = t('Product/Service');

    worksheet.mergeCells('G4:G8');
    worksheet.getCell('G4').value = t('Quantity');

    worksheet.mergeCells('H4:H8');
    worksheet.getCell('H4').value = t('Price');

    worksheet.mergeCells('I4:I8');
    worksheet.getCell('I4').value = t('Total');

    for (let i = 0; i < items.length; ) {
      const sale = items[i];
      const rowIndex = worksheet.rowCount + 1;
      const newRow = worksheet.getRow(rowIndex);
      ++i;

      if (typeof sale.price === 'string') {
        sale.price = parseFloat(sale.price);
      }

      worksheet.mergeCells(`E${rowIndex}:F${rowIndex}`);

      newRow.getCell('A').value = i;
      newRow.getCell('B').value = format(new Date(sale.date), 'dd.MM.yyyy');
      newRow.getCell('C').value = sale.customer?.name;
      newRow.getCell('D').value = t(sale.type);
      newRow.getCell('E').value = t(sale.product_type);
      newRow.getCell('G').value = sale.quantity;
      newRow.getCell('H').value = sale.price;
      newRow.getCell('I').value = formatMoney(sale.price * sale.quantity);

      this.addBorder(worksheet, rowIndex, 'B', 'I');
      newRow.commit();
    }

    this.setBgForHeader(worksheet, 9);

    worksheet.getCell('B2').style = {
      font: { bold: true, size: 20 },
      alignment: { vertical: 'middle', horizontal: 'left' },
    };

    worksheet.pageSetup.printArea = 'A1:Y100';
    worksheet.pageSetup.orientation = 'landscape';
    worksheet.pageSetup.fitToPage = true;
    worksheet.pageSetup.fitToWidth = 1;
    worksheet.pageSetup.fitToHeight = 5;

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }
}
