import { Injectable } from '@nestjs/common';
import { formatArea } from '../../utils/formatarea';
import { Language } from '../../localization';
import * as ExcelJS from 'exceljs';
import { Xlsx } from '../../abstracts/xlsx';
import { Zone } from '../members/zone.entity';

@Injectable()
export class ZoneXlsxService extends Xlsx<Zone> {
  constructor() {
    super();
  }

  async export(items: Zone[], language: Language = 'sq') {
    const { t } = this.translations(language);
    const title = t('List of Zones');
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

    this.addBorder(worksheet, 8, 'B', 'M');
    this.addBgColor(worksheet, 8, 'F', 'G', 'FFD9D9D9');
    this.setBold(worksheet, 8);

    this.setBold(worksheet, 6);

    worksheet.mergeCells('B4:B8');
    worksheet.getCell('B4').value = t('Code');

    worksheet.mergeCells('C4:C8');
    worksheet.getCell('C4').value = t('Name');

    worksheet.mergeCells('D4:D8');
    worksheet.getCell('D4').value = t('Number of Harvesters');

    worksheet.mergeCells('E4:G8');
    worksheet.getCell('E4').value = t('Total Area');

    worksheet.mergeCells('H4:I8');
    worksheet.getCell('H4').value = t('Latitude');

    worksheet.mergeCells('J4:K8');
    worksheet.getCell('J4').value = t('Longitude');

    worksheet.mergeCells('L4:M8');
    worksheet.getCell('L4').value = t('Map Document');

    for (let i = 0; i < items.length; ) {
      const zone = items[i];
      const rowIndex = worksheet.rowCount + 1;
      const newRow = worksheet.getRow(rowIndex);
      ++i;

      worksheet.mergeCells(`E${rowIndex}:G${rowIndex}`);
      worksheet.mergeCells(`H${rowIndex}:I${rowIndex}`);
      worksheet.mergeCells(`J${rowIndex}:K${rowIndex}`);
      worksheet.mergeCells(`L${rowIndex}:M${rowIndex}`);

      newRow.getCell('A').value = i;
      newRow.getCell('B').value = zone.code;
      newRow.getCell('C').value = zone.name;
      newRow.getCell('D').value = zone.num_of_harvesters;
      newRow.getCell('E').value = formatArea(zone.total_area, 'hectare');
      newRow.getCell('H').value = zone.latitude;
      newRow.getCell('J').value = zone.longitude;
      newRow.getCell('L').value = zone.file
        ? {
            text: t('Open Document'),
            hyperlink: zone.file,
          }
        : '';

      this.addBorder(worksheet, rowIndex, 'B', 'M');
      newRow.commit();
    }

    this.setBgForHeader(worksheet, 13);

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
