import * as ExcelJS from 'exceljs';
import { translation } from '../localization';

export abstract class Xlsx<Entity> {
  protected readonly translations = translation;

  public abstract export(
    items: Array<Entity>,
    type?: unknown,
  ): Promise<ExcelJS.Buffer>;

  protected setAlignment(worksheet: ExcelJS.Worksheet) {
    worksheet.columns.forEach((column) => {
      column.alignment = {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true,
      };
    });
  }

  protected setBgForHeader(worksheet: ExcelJS.Worksheet, cols?: number) {
    const row = worksheet.getRow(4);

    for (let i = 2; i <= (cols ? cols : 25); i++) {
      // Starting from column B which is index 2 to column Y which is index 25
      row.getCell(i).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD9D9D9' },
      };

      row.getCell(i).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };

      row.getCell(i).font = { bold: true };
    }
  }

  protected addBorder(
    worksheet: ExcelJS.Worksheet,
    rowIndex: number,
    fromCol: string,
    toCol: string,
  ) {
    for (let i = fromCol.charCodeAt(0); i <= toCol.charCodeAt(0); i++) {
      const col = String.fromCharCode(i);
      worksheet.getCell(`${col}${rowIndex}`).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    }
  }

  protected addBgColor(
    worksheet: ExcelJS.Worksheet,
    rowIndex: number,
    fromCol: string,
    toCol: string,
    color: string,
  ) {
    for (let i = fromCol.charCodeAt(0); i <= toCol.charCodeAt(0); i++) {
      const col = String.fromCharCode(i);
      worksheet.getCell(`${col}${rowIndex}`).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color },
      };
    }
  }

  protected setBold(worksheet: ExcelJS.Worksheet, rowIndex: number) {
    worksheet.getRow(rowIndex).font = { bold: true };
  }
}
