import { Injectable } from '@nestjs/common';
import { Xlsx } from '../../abstracts/xlsx';
import { Language } from '../../localization';
import * as ExcelJS from 'exceljs';
import { ContractedFarmer } from './contracted-farmer.entity';

@Injectable()
export class ContractedFarmerXlsxService extends Xlsx<ContractedFarmer> {
  constructor() {
    super();
  }

  async export(items: ContractedFarmer[], language: Language = 'sq') {
    const { t } = this.translations(language);
    const title = t('Ditari i Fermereve te Kontraktuar');
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

    worksheet.mergeCells('B4:B8');
    worksheet.getCell('B4').value = t('User Image');

    worksheet.mergeCells('C4:C8');
    worksheet.getCell('C4').value = t('Code');

    worksheet.mergeCells('D4:D8');
    worksheet.getCell('D4').value = t('First name');

    worksheet.mergeCells('E4:F8');
    worksheet.getCell('E4').value = t('Land Parcels');

    worksheet.mergeCells('G4:H8');
    worksheet.getCell('G4').value = t('Personal Number');

    worksheet.mergeCells('I4:K8');
    worksheet.getCell('I4').value = t('Address');

    worksheet.mergeCells('L4:M8');
    worksheet.getCell('L4').value = t('External Id');

    for (let i = 0; i < items.length; ) {
      const activity = items[i];
      const rowIndex = worksheet.rowCount + 1;
      const newRow = worksheet.getRow(rowIndex);

      ++i;

      worksheet.mergeCells(`E${rowIndex}:F${rowIndex}`);
      worksheet.mergeCells(`G${rowIndex}:H${rowIndex}`);
      worksheet.mergeCells(`I${rowIndex}:K${rowIndex}`);
      worksheet.mergeCells(`L${rowIndex}:M${rowIndex}`);

      newRow.getCell('A').value = i;
      newRow.getCell('B').value = activity.image
        ? {
            text: t('Open Image'),
            hyperlink: activity.image,
          }
        : '';
      newRow.getCell('C').value = activity.code;
      newRow.getCell('D').value = activity.name;
      newRow.getCell('E').value =
        activity.landParcels.map((parcel) => parcel.code).join(', ') || '';
      newRow.getCell('G').value = activity.personal_num;
      newRow.getCell('J').value = activity.address;
      newRow.getCell('M').value = activity.external_id;

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
