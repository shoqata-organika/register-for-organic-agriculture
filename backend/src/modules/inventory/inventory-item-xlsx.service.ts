import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { Xlsx } from '../../abstracts/xlsx';
import { Language } from '../../localization';
import { ta } from '../../utils/localized_attribute';
import { InventoryItem, InventoryItemType } from './inventory-item.entity';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const format = require('date-fns/format');

@Injectable()
export class InventoryItemXlsxService extends Xlsx<InventoryItem> {
  constructor() {
    super();
  }

  private _getXlsxColums(
    items: InventoryItem[],
    worksheet: ExcelJS.Worksheet,
    type: string,
    language: Language = 'sq',
  ) {
    const { t } = this.translations(language);

    // Common Atribute
    worksheet.mergeCells('B4:B8');
    worksheet.getCell('B4').value = t('Date');

    if (
      type === InventoryItemType.PROCESSED_PRODUCT ||
      type === InventoryItemType.DRIED_PRODUCT
    ) {
      worksheet.mergeCells('C4:C8');
      worksheet.getCell('C4').value = t('Lot Code');

      worksheet.mergeCells('D4:D8');
      worksheet.getCell('D4').value = t('Crop');

      worksheet.mergeCells('E4:F8');
      worksheet.getCell('E4').value = t('Part of Crop');

      worksheet.mergeCells('G4:G8');
      worksheet.getCell('G4').value = t('Location');

      worksheet.mergeCells('H4:H8');
      worksheet.getCell('H4').value = t('Quantity');

      worksheet.mergeCells('I4:I8');
      worksheet.getCell('I4').value = t('Packaging Type');

      worksheet.mergeCells('J4:K8');
      worksheet.getCell('J4').value = t('Comments');

      for (let i = 0; i < items.length; ) {
        const item = items[i];
        const rowIndex = worksheet.rowCount + 1;
        const newRow = worksheet.getRow(rowIndex);
        ++i;

        worksheet.mergeCells(`E${rowIndex}:F${rowIndex}`);
        worksheet.mergeCells(`J${rowIndex}:K${rowIndex}`);

        newRow.getCell('A').value = i;
        newRow.getCell('B').value = format(new Date(item.date), 'dd.MM.yyyy');
        newRow.getCell('C').value = item.admissionEntry.admission.admission_no;
        newRow.getCell('D').value = ta(item.crop, 'name', language);
        newRow.getCell('E').value = ta(item.partOfCrop, 'name', language);
        newRow.getCell('G').value = item.inventoryLocation?.name;
        newRow.getCell('H').value = item.quantity;
        newRow.getCell('I').value = t(item.packageType);
        newRow.getCell('J').value = item.notes;

        this.addBorder(worksheet, rowIndex, 'B', 'K');
        newRow.commit();
      }

      this.addBorder(worksheet, 8, 'B', 'K');
      this.setBgForHeader(worksheet, 11);
      return;
    }

    if (type === InventoryItemType.INPUT) {
      worksheet.mergeCells('C4:E8');
      worksheet.getCell('C4').value = t('Product Name');

      worksheet.mergeCells('F4:F8');
      worksheet.getCell('F4').value = t('Producer');

      worksheet.mergeCells('G4:G8');
      worksheet.getCell('G4').value = t('SKU');

      worksheet.mergeCells('H4:H8');
      worksheet.getCell('H4').value = t('Purchase Date');

      worksheet.mergeCells('I4:I8');
      worksheet.getCell('I4').value = t('Location');

      worksheet.mergeCells('J4:J8');
      worksheet.getCell('J4').value = t('Quantity');

      worksheet.mergeCells('K4:K8');
      worksheet.getCell('K4').value = t('Price');

      worksheet.mergeCells('L4:M8');
      worksheet.getCell('L4').value = t('Packaging Type');

      worksheet.mergeCells('N4:O8');
      worksheet.getCell('N4').value = t('Comments');

      for (let i = 0; i < items.length; ) {
        const item = items[i];
        const rowIndex = worksheet.rowCount + 1;
        const newRow = worksheet.getRow(rowIndex);
        ++i;

        newRow.getCell('A').value = i;
        newRow.getCell('B').value = format(new Date(item.date), 'dd.MM.yyyy');
        newRow.getCell('C').value = item?.name || '';
        newRow.getCell('F').value = item?.producer?.name || '';
        newRow.getCell('G').value = item.sku || '';
        newRow.getCell('H').value = item.purchaseDate
          ? format(new Date(item.purchaseDate), 'dd.MM.yyyy')
          : '';
        newRow.getCell('I').value = item.inventoryLocation?.name || '';
        newRow.getCell('J').value = item.quantity;
        newRow.getCell('K').value = item.cost;
        newRow.getCell('L').value = t(item.packageType);
        newRow.getCell('N').value = item.notes;

        this.addBorder(worksheet, rowIndex, 'B', 'O');
        newRow.commit();
      }

      this.addBorder(worksheet, 8, 'B', 'O');
      this.setBgForHeader(worksheet, 15);

      return;
    }

    if (type === InventoryItemType.PLANTING_MATERIAL) {
      worksheet.mergeCells('C4:E8');
      worksheet.getCell('C4').value = t('Product Name');

      worksheet.mergeCells('F4:F8');
      worksheet.getCell('F4').value = t('SKU');

      worksheet.mergeCells('G4:G8');
      worksheet.getCell('G4').value = t('Purchase Date');

      worksheet.mergeCells('H4:H8');
      worksheet.getCell('H4').value = t('Location');

      worksheet.mergeCells('I4:I8');
      worksheet.getCell('I4').value = t('Quantity');

      worksheet.mergeCells('J4:J8');
      worksheet.getCell('J4').value = t('Price');

      worksheet.mergeCells('K4:L8');
      worksheet.getCell('K4').value = t('Package Type');

      worksheet.mergeCells('M4:N8');
      worksheet.getCell('M4').value = t('Comments');

      for (let i = 0; i < items.length; ) {
        const item = items[i];
        const rowIndex = worksheet.rowCount + 1;
        const newRow = worksheet.getRow(rowIndex);
        ++i;

        worksheet.mergeCells(`M${rowIndex}:N${rowIndex}`);

        newRow.getCell('A').value = i;
        newRow.getCell('B').value = format(new Date(item.date), 'dd.MM.yyyy');
        newRow.getCell('C').value = item?.name || '';
        newRow.getCell('F').value = item?.sku;
        newRow.getCell('G').value = item.purchaseDate
          ? format(new Date(item.purchaseDate), 'dd.MM.yyyy')
          : '';
        newRow.getCell('H').value = item.inventoryLocation?.name || '';
        newRow.getCell('I').value = item.quantity;
        newRow.getCell('J').value = item.cost;
        newRow.getCell('K').value = t(item.packageType);
        newRow.getCell('M').value = item.notes;

        this.addBorder(worksheet, rowIndex, 'B', 'N');
        newRow.commit();
      }

      this.addBorder(worksheet, 8, 'B', 'N');
      this.setBgForHeader(worksheet, 14);

      return;
    }

    if (
      type === InventoryItemType.HARVESTED_PRODUCT ||
      type === InventoryItemType.COLLECTED_PRODUCT
    ) {
      worksheet.mergeCells('C4:C8');
      worksheet.getCell('C4').value = t('Admission Number');

      worksheet.mergeCells('D4:D8');
      worksheet.getCell('D4').value = t('Crop');

      worksheet.mergeCells('E4:E8');
      worksheet.getCell('E4').value = t('Part Of Crop');

      worksheet.mergeCells('F4:F8');
      worksheet.getCell('F4').value = t('Location');

      worksheet.mergeCells('G4:G8');
      worksheet.getCell('G4').value = t('Quantity');

      worksheet.mergeCells('H4:H8');
      worksheet.getCell('H4').value = t('Packaging Type');

      worksheet.mergeCells('I4:J8');
      worksheet.getCell('I4').value = t('Comments');

      for (let i = 0; i < items.length; ) {
        const item = items[i];
        const rowIndex = worksheet.rowCount + 1;
        const newRow = worksheet.getRow(rowIndex);
        ++i;

        worksheet.mergeCells(`I${rowIndex}:J${rowIndex}`);

        newRow.getCell('A').value = i;
        newRow.getCell('B').value = format(new Date(item.date), 'dd.MM.yyyy');
        newRow.getCell('C').value = item.admissionEntry.admission.admission_no;
        newRow.getCell('D').value = ta(item.crop, 'name', language);
        newRow.getCell('E').value = ta(item.partOfCrop, 'name', language);
        newRow.getCell('F').value = item.inventoryLocation?.name || '';
        newRow.getCell('G').value = item.quantity;
        newRow.getCell('H').value = t(item.packageType);
        newRow.getCell('I').value = item.notes;

        this.addBorder(worksheet, rowIndex, 'B', 'J');
        newRow.commit();
      }

      this.addBorder(worksheet, 8, 'B', 'J');
      this.setBgForHeader(worksheet, 10);
    }
  }

  async export(
    items: InventoryItem[],
    type: string,
    language: 'sq' | 'en' | 'sb' = 'sq',
  ) {
    let title = type;
    const { t } = this.translations(language);

    switch (title) {
      case InventoryItemType.HARVESTED_PRODUCT: {
        title = 'Ditari i Produkteve te Kultivuara';
        break;
      }
      case InventoryItemType.COLLECTED_PRODUCT: {
        title = 'Ditari i Produkteve te Grumbulluara';
        break;
      }
      case InventoryItemType.PROCESSED_PRODUCT: {
        title = 'Ditari i Produkteve Finale';
        break;
      }
      case InventoryItemType.INPUT: {
        title = 'Ditari i Inputeve';
        break;
      }
      case InventoryItemType.PLANTING_MATERIAL: {
        title = 'Ditari i Materialeve Mbjellese';
        break;
      }
      case InventoryItemType.DRIED_PRODUCT: {
        title = 'Ditari i Produkteve te Thara';
        break;
      }
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(t(title));

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
    worksheet.getCell('B2').value = t(title);

    this.setAlignment(worksheet);

    this.setBold(worksheet, 8);

    this.setBold(worksheet, 6);

    this._getXlsxColums(items, worksheet, type, language);

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
