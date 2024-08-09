import { Injectable } from '@nestjs/common';
import { Xlsx } from '../../abstracts/xlsx';
import { CleaningActivity } from './cleaning-activity.entity';
import { Language } from '../../localization';
import * as ExcelJS from 'exceljs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const format = require('date-fns/format');

@Injectable()
export class CleaningActivityXlsxService extends Xlsx<CleaningActivity> {
  constructor() {
    super();
  }

  async export(items: CleaningActivity[], language: Language = 'sq') {
    const { t } = this.translations(language);
    const title = t('List of Cleanings');
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

    this.addBorder(worksheet, 8, 'B', 'O');
    this.setBold(worksheet, 8);

    this.setBold(worksheet, 6);

    worksheet.mergeCells('B4:B8');
    worksheet.getCell('B4').value = t('Date');

    worksheet.mergeCells('C4:D8');
    worksheet.getCell('C4').value = t('Processing Unit');

    worksheet.mergeCells('E4:F8');
    worksheet.getCell('E4').value = t('Cleaning Tool');

    worksheet.mergeCells('G4:H8');
    worksheet.getCell('G4').value = t('Cleaned Device');

    worksheet.mergeCells('I4:J8');
    worksheet.getCell('I4').value = t('Reason of Cleaning');

    worksheet.mergeCells('K4:L8');
    worksheet.getCell('K4').value = t('Cleaning Area');

    worksheet.mergeCells('M4:M8');
    worksheet.getCell('M4').value = t('Responsible Person');

    worksheet.mergeCells('N4:O8');
    worksheet.getCell('N4').value = t('Notes');

    for (let i = 0; i < items.length; ) {
      const activity = items[i];
      const rowIndex = worksheet.rowCount + 1;
      const newRow = worksheet.getRow(rowIndex);
      ++i;

      worksheet.mergeCells(`C${rowIndex}:D${rowIndex}`);
      worksheet.mergeCells(`E${rowIndex}:F${rowIndex}`);
      worksheet.mergeCells(`G${rowIndex}:H${rowIndex}`);
      worksheet.mergeCells(`I${rowIndex}:J${rowIndex}`);
      worksheet.mergeCells(`K${rowIndex}:L${rowIndex}`);
      worksheet.mergeCells(`N${rowIndex}:O${rowIndex}`);

      newRow.getCell('A').value = i;
      newRow.getCell('B').value = format(new Date(activity.date), 'dd.MM.yyyy');
      newRow.getCell('C').value = activity.processingUnit?.name;
      newRow.getCell('E').value = activity.cleaning_tool;
      newRow.getCell('G').value = activity.cleaned_device;
      newRow.getCell('I').value = activity.reason_of_cleaning;
      newRow.getCell('K').value = activity.area;
      newRow.getCell('M').value = activity.person?.name;
      newRow.getCell('N').value = activity.notes;

      this.addBorder(worksheet, rowIndex, 'B', 'O');
      newRow.commit();
    }

    this.setBgForHeader(worksheet, 14);

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
