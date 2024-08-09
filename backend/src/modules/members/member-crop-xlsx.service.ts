import { Injectable } from '@nestjs/common';
import { Xlsx } from '../../abstracts/xlsx';
import * as ExcelJS from 'exceljs';
import { ta } from '../../utils/localized_attribute';
import { MemberCrop } from './member-crop.entity';
import { Language } from '../../localization';

@Injectable()
export class MemberCropXlsxService extends Xlsx<MemberCrop> {
  constructor() {
    super();
  }

  async export(items: Array<MemberCrop>, language: Language = 'sq') {
    const { t } = this.translations(language);
    const title = t('List of Crops');
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

    worksheet.mergeCells('B4:B8');
    worksheet.getCell('B4').value = t('Previous Crop Code');

    worksheet.mergeCells('C4:C8');
    worksheet.getCell('C4').value = t('Modified Crop Code');

    worksheet.mergeCells('D4:D8');
    worksheet.getCell('D4').value = t('Crop Name');

    for (let i = 0; i < items.length; ) {
      const item = items[i];
      const rowIndex = worksheet.rowCount + 1;
      const newRow = worksheet.getRow(rowIndex);
      ++i;

      newRow.getCell('A').value = i;
      newRow.getCell('B').value = item.crop.code;
      newRow.getCell('C').value = item.code;
      newRow.getCell('D').value = ta(item.crop, 'name', language);

      this.addBorder(worksheet, rowIndex, 'B', 'D');
      newRow.commit();
    }

    worksheet.getCell('B2').style = {
      font: { bold: true, size: 20 },
      alignment: { vertical: 'middle', horizontal: 'left' },
    };

    this.setBgForHeader(worksheet, 4);

    worksheet.pageSetup.printArea = 'A1:Y100';
    worksheet.pageSetup.orientation = 'landscape';
    worksheet.pageSetup.fitToPage = true;
    worksheet.pageSetup.fitToWidth = 1;
    worksheet.pageSetup.fitToHeight = 5;

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }
}
