import { Injectable } from '@nestjs/common';
import { formatArea } from '../../utils/formatarea';
import { Xlsx } from '../../abstracts/xlsx';
import * as ExcelJS from 'exceljs';
import { Language } from '../../localization';
import { ProcessingUnit } from './processing-unit.entity';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const format = require('date-fns/format');

@Injectable()
export class ProcessingUnitXlsxService extends Xlsx<ProcessingUnit> {
  constructor() {
    super();
  }

  async export(items: ProcessingUnit[], language: Language = 'sq') {
    const { t } = this.translations(language);
    const title = t('List of Processing Units');
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
    this.setBold(worksheet, 8);

    this.setBold(worksheet, 6);

    worksheet.mergeCells('B4:B8');
    worksheet.getCell('B4').value = t('Name');

    worksheet.mergeCells('C4:C8');
    worksheet.getCell('C4').value = t('Ownership Status');

    worksheet.mergeCells('D4:D8');
    worksheet.getCell('D4').value = t('Contract Start Date');

    worksheet.mergeCells('E4:E8');
    worksheet.getCell('E4').value = t('Contract End Date');

    worksheet.mergeCells('F4:F8');
    worksheet.getCell('F4').value = t('Type of Processing');

    worksheet.mergeCells('G4:H8');
    worksheet.getCell('G4').value = t('Total Area (sqm)');

    worksheet.mergeCells('I4:I8');
    worksheet.getCell('I4').value = t('Address');

    worksheet.mergeCells('J4:K8');
    worksheet.getCell('J4').value = t('Latitude');

    worksheet.mergeCells('L4:M8');
    worksheet.getCell('L4').value = t('Longitude');

    worksheet.mergeCells('N4:O8');
    worksheet.getCell('N4').value = t('Map Document');

    for (let i = 0; i < items.length; ) {
      const activity = items[i];
      const rowIndex = worksheet.rowCount + 1;
      const newRow = worksheet.getRow(rowIndex);
      ++i;

      worksheet.mergeCells(`G${rowIndex}:H${rowIndex}`);
      worksheet.mergeCells(`J${rowIndex}:K${rowIndex}`);
      worksheet.mergeCells(`L${rowIndex}:M${rowIndex}`);
      worksheet.mergeCells(`N${rowIndex}:O${rowIndex}`);

      newRow.getCell('A').value = i;
      newRow.getCell('B').value = activity.name;
      newRow.getCell('C').value = t(activity.ownership_status);
      newRow.getCell('D').value = activity.contract_start_date
        ? format(new Date(activity.contract_start_date), 'dd.MM.yyyy')
        : '';
      newRow.getCell('E').value = activity.contract_end_date
        ? format(new Date(activity.contract_end_date), 'dd.MM.yyyy')
        : '';
      newRow.getCell('F').value = t(activity.type_of_processing);
      newRow.getCell('G').value = formatArea(
        activity.total_area,
        'square-meter',
      );
      newRow.getCell('I').value = activity.address;
      newRow.getCell('J').value = activity.latitude;
      newRow.getCell('L').value = activity.longitude;
      newRow.getCell('N').value = activity.file
        ? {
            text: t('Open Document'),
            hyperlink: activity.file,
          }
        : '';

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
