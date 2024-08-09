import { Injectable } from '@nestjs/common';
import { Xlsx } from '../../abstracts/xlsx';
import { Language } from '../../localization';
import { ta } from '../../utils/localized_attribute';
import * as ExcelJS from 'exceljs';
import { AdmissionType, Admission } from './admission.entity';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const format = require('date-fns/format');

@Injectable()
export class AdmissionXlsxService extends Xlsx<Admission> {
  constructor() {
    super();
  }

  async export(items: Admission[], type: string, language: Language = 'sq') {
    let title = type;
    const isCollection = type === AdmissionType.COLLECTION;
    const { t } = this.translations(language);

    if (title === AdmissionType.PURCHASE) {
      title = t('Purchase Admissions');
    } else if (isCollection) {
      title = t('Admissions List');
    }

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

    this.addBorder(worksheet, 8, 'F', 'G');
    this.addBgColor(worksheet, 8, 'F', 'G', 'FFD9D9D9');
    this.setBold(worksheet, 8);

    this.setBold(worksheet, 6);

    worksheet.mergeCells('B4:B8');
    worksheet.getCell('B4').value = t('Date');

    worksheet.mergeCells('C4:C8');
    worksheet.getCell('C4').value = t('Admission Number');

    worksheet.mergeCells('D4:D8');
    worksheet.getCell('D4').value = t(
      isCollection ? 'Zone Code' : 'Land Parcel Code',
    );

    if (type === AdmissionType.PURCHASE) {
      worksheet.mergeCells('E4:E8');
      worksheet.getCell('E4').value = t('Parcel Ownership');

      worksheet.mergeCells('F4:G8');
      worksheet.getCell('F4').value = t('Crop');

      worksheet.mergeCells('H4:I8');
      worksheet.getCell('H4').value = t('Part Of Crop');

      worksheet.mergeCells('J4:K8');
      worksheet.getCell('J4').value = t('Crop State');

      worksheet.mergeCells('L4:M8');
      worksheet.getCell('L4').value = t('Crop Status');

      worksheet.mergeCells('N4:O8');
      worksheet.getCell('N4').value = isCollection
        ? t('Harvester')
        : t('Contracted Farmer');

      worksheet.mergeCells('P4:P8');
      worksheet.getCell('P4').value = t('Net Quantity');

      worksheet.mergeCells('Q4:Q8');
      worksheet.getCell('Q4').value = t('Gross Quantity');

      worksheet.mergeCells('R4:S8');
      worksheet.getCell('R4').value = t('Comments');

      let admissionEntryIndex = 0;

      for (let i = 0; i < items.length; i++) {
        const admission = items[i];
        const admission_no = admission.admission_no;
        const date = admission.date;
        const contractedFarmer = admission.contractedFarmer
          ? `${admission.contractedFarmer.code} - ${admission.contractedFarmer.name}`
          : '';

        for (let j = 0; j < admission.entries.length; j++) {
          const entry = admission.entries[j];
          const rowIndex = worksheet.rowCount + 1;
          const newRow = worksheet.getRow(rowIndex);

          worksheet.mergeCells(`F${rowIndex}:G${rowIndex}`);
          worksheet.mergeCells(`H${rowIndex}:I${rowIndex}`);
          worksheet.mergeCells(`J${rowIndex}:K${rowIndex}`);
          worksheet.mergeCells(`L${rowIndex}:M${rowIndex}`);
          worksheet.mergeCells(`N${rowIndex}:O${rowIndex}`);
          worksheet.mergeCells(`R${rowIndex}:S${rowIndex}`);

          newRow.getCell('A').value = ++admissionEntryIndex;
          newRow.getCell('B').value = format(new Date(date), 'dd.MM.yyyy');
          newRow.getCell('C').value = admission_no;
          newRow.getCell('D').value =
            admission.landParcel?.code || admission.zone?.code;
          newRow.getCell('E').value = admission.contracted_farmer_id
            ? t('Farmers')
            : t('Member');
          newRow.getCell('F').value = ta(entry.crop, 'name', language);
          newRow.getCell('H').value = ta(entry.partOfCrop, 'name', language);
          newRow.getCell('J').value = t(entry.cropState);
          newRow.getCell('L').value = t(entry.cropStatus);
          newRow.getCell('N').value = contractedFarmer;
          newRow.getCell('P').value = entry.net_quantity;
          newRow.getCell('Q').value = entry.gross_quantity;
          newRow.getCell('R').value = entry.notes;

          this.addBorder(worksheet, rowIndex, 'B', 'S');

          newRow.commit();
        }
      }

      this.setBgForHeader(worksheet, 19);
    }

    if (type === AdmissionType.COLLECTION) {
      worksheet.mergeCells('E4:F8');
      worksheet.getCell('E4').value = t('Crop');

      worksheet.mergeCells('G4:H8');
      worksheet.getCell('G4').value = t('Part Of Crop');

      worksheet.mergeCells('I4:J8');
      worksheet.getCell('I4').value = t('Crop State');

      worksheet.mergeCells('K4:L8');
      worksheet.getCell('K4').value = t('Crop Status');

      worksheet.mergeCells('M4:N8');
      worksheet.getCell('M4').value = isCollection
        ? t('Harvester')
        : t('Contracted Farmer');

      worksheet.mergeCells('O4:O8');
      worksheet.getCell('O4').value = t('Net Quantity');

      worksheet.mergeCells('P4:P8');
      worksheet.getCell('P4').value = t('Gross Quantity');

      worksheet.mergeCells('Q4:R8');
      worksheet.getCell('Q4').value = t('Comments');

      let admissionEntryIndex = 0;

      for (let i = 0; i < items.length; i++) {
        const admission = items[i];
        const admission_no = admission.admission_no;
        const date = admission.date;
        const harvester = admission.harvester
          ? `${admission.harvester.code} - ${admission.harvester.first_name}`
          : '';

        for (let j = 0; j < admission.entries.length; j++) {
          const entry = admission.entries[j];
          const rowIndex = worksheet.rowCount + 1;
          const newRow = worksheet.getRow(rowIndex);

          worksheet.mergeCells(`E${rowIndex}:F${rowIndex}`);
          worksheet.mergeCells(`G${rowIndex}:H${rowIndex}`);
          worksheet.mergeCells(`I${rowIndex}:J${rowIndex}`);
          worksheet.mergeCells(`K${rowIndex}:L${rowIndex}`);
          worksheet.mergeCells(`M${rowIndex}:N${rowIndex}`);
          worksheet.mergeCells(`Q${rowIndex}:R${rowIndex}`);

          newRow.getCell('A').value = ++admissionEntryIndex;
          newRow.getCell('B').value = format(new Date(date), 'dd.MM.yyyy');
          newRow.getCell('C').value = admission_no;
          newRow.getCell('D').value =
            admission.landParcel?.code || admission.zone?.code;
          newRow.getCell('E').value = ta(entry.crop, 'name', language);
          newRow.getCell('G').value = ta(entry.partOfCrop, 'name', language);
          newRow.getCell('I').value = t(entry.cropState);
          newRow.getCell('K').value = t(entry.cropStatus);
          newRow.getCell('M').value = harvester;
          newRow.getCell('O').value = entry.net_quantity;
          newRow.getCell('P').value = entry.gross_quantity;
          newRow.getCell('Q').value = entry.notes;

          this.addBorder(worksheet, rowIndex, 'B', 'R');

          newRow.commit();
        }
      }

      this.setBgForHeader(worksheet, 18);
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
}
