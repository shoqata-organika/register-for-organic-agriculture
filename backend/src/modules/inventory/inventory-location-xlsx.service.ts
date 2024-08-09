import { Injectable } from '@nestjs/common';
import { Xlsx } from '../../abstracts/xlsx';
import { Language } from '../../localization';
import * as ExcelJS from 'exceljs';
import { InventoryLocation } from './inventory-location.entity';

@Injectable()
export class InventoryLocationXlsxService extends Xlsx<InventoryLocation> {
  constructor() {
    super();
  }

  async export(items: InventoryLocation[], language: Language = 'sq') {
    const { t } = this.translations(language);
    const title = t('Inventory Locations');

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

    this.setBold(worksheet, 8);

    this.setBold(worksheet, 6);

    worksheet.mergeCells('B4:D8');
    worksheet.getCell('B4').value = t('Name');

    worksheet.mergeCells('E4:E8');
    worksheet.getCell('E4').value = t('Area (sqm)');

    for (let i = 0; i < items.length; ) {
      const location = items[i];
      const rowIndex = worksheet.rowCount + 1;
      const newRow = worksheet.getRow(rowIndex);
      ++i;

      worksheet.mergeCells(`B${rowIndex}:D${rowIndex}`);

      newRow.getCell('A').value = i;
      newRow.getCell('B').value = location.name;
      newRow.getCell('E').value = location.area;

      this.addBorder(worksheet, rowIndex, 'B', 'E');
      newRow.commit();
    }

    this.addBorder(worksheet, 8, 'B', 'E');
    this.setBgForHeader(worksheet, 2);

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
