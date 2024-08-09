import { Injectable } from '@nestjs/common';
import { Xlsx } from '../../abstracts/xlsx';
import * as ExcelJS from 'exceljs';
import { Harvester } from '../members/harvester.entity';
import { Language } from '../../localization';

@Injectable()
export class HarvesterXlsxService extends Xlsx<Harvester> {
  constructor() {
    super();
  }

  async export(items: Harvester[], language: Language = 'sq') {
    const { t } = this.translations(language);
    const title = t('List of Harvesters');
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

    this.addBgColor(worksheet, 8, 'F', 'G', 'FFD9D9D9');
    this.setBold(worksheet, 8);

    this.setBold(worksheet, 6);

    worksheet.mergeCells('B4:B8');
    worksheet.getCell('B4').value = t('Image');

    worksheet.mergeCells('C4:C8');
    worksheet.getCell('C4').value = t('First name');

    worksheet.mergeCells('D4:D8');
    worksheet.getCell('D4').value = t('Last name');

    worksheet.mergeCells('E4:E8');
    worksheet.getCell('E4').value = t('Code');

    worksheet.mergeCells('F4:G8');
    worksheet.getCell('F4').value = t('Address');

    worksheet.mergeCells('H4:H8');
    worksheet.getCell('H4').value = t('Legal Status');

    worksheet.mergeCells('I4:I8');
    worksheet.getCell('I4').value = t('Zone Code');

    worksheet.mergeCells('J4:K8');
    worksheet.getCell('J4').value = t('Contract File');

    for (let i = 0; i < items.length; ) {
      const activity = items[i];
      const rowIndex = worksheet.rowCount + 1;
      const newRow = worksheet.getRow(rowIndex);
      ++i;

      worksheet.mergeCells(`F${rowIndex}:G${rowIndex}`);
      worksheet.mergeCells(`J${rowIndex}:K${rowIndex}`);

      newRow.getCell('A').value = i;
      newRow.getCell('B').value = activity.image
        ? {
            text: t('Open Document'),
            hyperlink: activity.image,
          }
        : '';
      newRow.getCell('C').value = activity.first_name;
      newRow.getCell('D').value = activity.last_name;
      newRow.getCell('E').value = activity.code;
      newRow.getCell('F').value = activity.address;
      newRow.getCell('H').value = t(activity.legal_status);
      newRow.getCell('I').value = activity.zone?.code;
      newRow.getCell('J').value = activity.contract_file
        ? {
            text: t('Open Document'),
            hyperlink: activity.contract_file,
          }
        : '';

      this.addBorder(worksheet, rowIndex, 'B', 'K');
      newRow.commit();
    }

    this.setBgForHeader(worksheet, 11);

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
