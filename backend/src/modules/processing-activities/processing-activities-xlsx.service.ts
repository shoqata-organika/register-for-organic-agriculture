import { Injectable } from '@nestjs/common';
import { Xlsx } from '../../abstracts/xlsx';
import { ProcessingActivityDto } from './dto';
import { ProcessingType } from '../activities/processing-activity.entity';
import { ta } from '../../utils/localized_attribute';
import { Language } from '../../localization';
import * as ExcelJS from 'exceljs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const format = require('date-fns/format');

@Injectable()
export class ProcessingActivitiesXlsxService extends Xlsx<ProcessingActivityDto> {
  constructor() {
    super();
  }

  async export(
    items: ProcessingActivityDto[],
    type?: ProcessingType,
    language: Language = 'sq',
  ) {
    const { t } = this.translations(language);
    const title =
      type && type === ProcessingType.DRYING
        ? t('Drying Activities')
        : t('Processing Activities');
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

    this.addBorder(worksheet, 8, 'B', 'Q');
    this.setBold(worksheet, 8);

    this.setBold(worksheet, 6);

    worksheet.mergeCells('B4:B8');
    worksheet.getCell('B4').value = t('Date');

    worksheet.mergeCells('C4:C8');
    worksheet.getCell('C4').value = t('Admission Number');

    worksheet.mergeCells('D4:D8');
    worksheet.getCell('D4').value = t('Zone/Land Parcel');

    worksheet.mergeCells('E4:E8');
    worksheet.getCell('E4').value = t('Processing Unit');

    worksheet.mergeCells('F4:F8');
    worksheet.getCell('F4').value = t('Crop');

    worksheet.mergeCells('G4:G8');
    worksheet.getCell('G4').value = t('Part of crop');

    worksheet.mergeCells('H4:I8');
    worksheet.getCell('H4').value = t('Processing Method');

    worksheet.mergeCells('J4:K8');
    worksheet.getCell('J4').value = t('Processing Type');

    if (type === ProcessingType.DRYING) {
      worksheet.mergeCells('L4:L8');
      worksheet.getCell('L4').value = t('Drier Number');

      worksheet.mergeCells('M4:M8');
      worksheet.getCell('M4').value = t('Drier Temperature');

      worksheet.mergeCells('N4:N8');
      worksheet.getCell('N4').value = t('Drying Start Date');

      worksheet.mergeCells('O4:O8');
      worksheet.getCell('O4').value = t('Drying End Date');

      worksheet.mergeCells('P4:P8');
      worksheet.getCell('P4').value = t('Drier Start Time');

      worksheet.mergeCells('Q4:Q8');
      worksheet.getCell('Q4').value = t('Drier End Time');

      worksheet.mergeCells('R4:R8');
      worksheet.getCell('R4').value = t('Gross Quantity');

      worksheet.mergeCells('S4:S8');
      worksheet.getCell('S4').value = t('Net Quantity');

      worksheet.mergeCells('T4:T8');
      worksheet.getCell('T4').value = t('Firo');

      worksheet.mergeCells('U4:U8');
      worksheet.getCell('U4').value = t('Lot Code');

      worksheet.mergeCells('V4:W8');
      worksheet.getCell('V4').value = t('Notes');

      for (let i = 0; i < items.length; ) {
        const activity = items[i];
        const rowIndex = worksheet.rowCount + 1;
        const newRow = worksheet.getRow(rowIndex);
        ++i;

        worksheet.mergeCells(`H${rowIndex}:I${rowIndex}`);
        worksheet.mergeCells(`J${rowIndex}:K${rowIndex}`);
        worksheet.mergeCells(`V${rowIndex}:W${rowIndex}`);

        newRow.getCell('A').value = i;
        newRow.getCell('B').value = format(
          new Date(activity.date),
          'dd.MM.yyyy',
        );
        newRow.getCell('C').value = activity.admission_no;
        newRow.getCell('D').value = activity.zone?.code;
        newRow.getCell('E').value = activity.processing_unit?.name || '';
        newRow.getCell('F').value = ta(activity.crop, 'name', language);
        newRow.getCell('G').value = ta(activity.partOfCrop, 'name', language);
        newRow.getCell('H').value = ta(
          activity.processing_method,
          'name',
          language,
        );
        newRow.getCell('J').value = t(activity.processing_type);
        newRow.getCell('L').value = activity.drier_number;
        newRow.getCell('M').value = activity.drier_temp;
        newRow.getCell('N').value = activity.drying_start_date
          ? format(new Date(activity.drying_start_date), 'dd.MM.yyyy')
          : '';
        newRow.getCell('O').value = activity.drying_end_date
          ? format(new Date(activity.drying_end_date), 'dd.MM.yyyy')
          : '';
        newRow.getCell('P').value = this.timespentFormat(
          activity.drier_start_hour,
        );
        newRow.getCell('Q').value = this.timespentFormat(
          activity.drier_end_hour,
        );
        newRow.getCell('R').value = activity.gross_quantity;
        newRow.getCell('S').value = activity.net_quantity;
        newRow.getCell('T').value = activity.firo;
        newRow.getCell('U').value = activity.lot_code;
        newRow.getCell('V').value = activity.notes;

        this.addBorder(worksheet, rowIndex, 'B', 'W');
        newRow.commit();
      }

      this.setBgForHeader(worksheet, 23);
    } else {
      worksheet.mergeCells('L4:L8');
      worksheet.getCell('L4').value = t('Gross Quantity');

      worksheet.mergeCells('M4:M8');
      worksheet.getCell('M4').value = t('Net Quantity');

      worksheet.mergeCells('N4:N8');
      worksheet.getCell('N4').value = t('Firo');

      worksheet.mergeCells('O4:O8');
      worksheet.getCell('O4').value = t('Lot Code');

      worksheet.mergeCells('P4:Q8');
      worksheet.getCell('P4').value = t('Notes');

      for (let i = 0; i < items.length; ) {
        const activity = items[i];
        const rowIndex = worksheet.rowCount + 1;
        const newRow = worksheet.getRow(rowIndex);
        ++i;

        worksheet.mergeCells(`H${rowIndex}:I${rowIndex}`);
        worksheet.mergeCells(`J${rowIndex}:K${rowIndex}`);
        worksheet.mergeCells(`P${rowIndex}:Q${rowIndex}`);

        newRow.getCell('A').value = i;
        newRow.getCell('B').value = format(
          new Date(activity.date),
          'dd.MM.yyyy',
        );
        newRow.getCell('C').value = activity.admission_no;
        newRow.getCell('D').value = activity.zone?.code;
        newRow.getCell('E').value = activity.processing_unit?.name || '';
        newRow.getCell('F').value = ta(activity.crop, 'name', language);
        newRow.getCell('G').value = ta(activity.partOfCrop, 'name', language);
        newRow.getCell('H').value = ta(
          activity.processing_method,
          'name',
          language,
        );
        newRow.getCell('J').value = t(activity.processing_type);
        newRow.getCell('L').value = activity.gross_quantity;
        newRow.getCell('M').value = activity.net_quantity;
        newRow.getCell('N').value = activity.firo;
        newRow.getCell('O').value = activity.lot_code;
        newRow.getCell('P').value = activity.notes;

        this.addBorder(worksheet, rowIndex, 'B', 'Q');
        newRow.commit();
      }

      this.setBgForHeader(worksheet, 17);
    }

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

  private timespentFormat(value: number): string {
    if (!value) return '';

    const formatH = value < 10 ? `0${value}` : value;

    return `${formatH}:00`;
  }
}
