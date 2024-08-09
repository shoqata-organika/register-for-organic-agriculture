import { Injectable } from '@nestjs/common';
import { LandParcel } from '../land-parcels/land-parcel.entity';
import { Xlsx } from '../../abstracts/xlsx';
import { Language } from '../../localization';
import { ta } from '../../utils/localized_attribute';
import * as ExcelJS from 'exceljs';
import * as groupBy from 'lodash/groupBy';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const format = require('date-fns/format');

@Injectable()
export class LandParcelXlsxService extends Xlsx<LandParcel> {
  constructor() {
    super();
  }

  async export(landParcels: LandParcel[], language: Language = 'sq') {
    const workbook = new ExcelJS.Workbook();
    const { t } = this.translations(language);
    const worksheet = workbook.addWorksheet(t('Land Parcel List'));
    const years = [2023, 2024, 2025, 2026, 2027];

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
    worksheet.getCell('B2').value = t('Land Parcel List');

    // Merging cells for the complex header
    worksheet.mergeCells('B4:B8');
    worksheet.getCell('B4').value = t('Land Parcel Code');

    worksheet.mergeCells('C4:C8');
    worksheet.getCell('C4').value = t('Cadastral Number');

    worksheet.mergeCells('D4:D8');
    worksheet.getCell('D4').value = t('Location');

    worksheet.mergeCells('E4:E8');
    worksheet.getCell('E4').value = t('Status');

    worksheet.mergeCells('F4:G7');
    worksheet.getCell('F4').value = t('Duration of the rental contract');
    worksheet.getCell('F4').alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };

    worksheet.getCell('F8').value = t('Contract Start Date');
    worksheet.getCell('G8').value = t('Contract End Date');

    worksheet.mergeCells('H4:H8');
    worksheet.getCell('H4').value = t('Total Area');

    worksheet.mergeCells('I4:I8');
    worksheet.getCell('I4').value = t('Utilised Area');

    worksheet.mergeCells('J4:J8');
    worksheet.getCell('J4').value = t('Buffer Zone');

    worksheet.mergeCells('K4:L5');
    worksheet.getCell('K4').value = `${years[0]} (${t('last year')})`;
    worksheet.getCell('K4').alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };

    worksheet.mergeCells('K6:K8');
    worksheet.getCell('K6').value = `${t('Crop')} 1`;
    worksheet.getCell('K6').alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };

    worksheet.mergeCells('L6:L8');
    worksheet.getCell('L6').value = `${t('Crop')} 2`;
    worksheet.getCell('L6').alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };

    worksheet.mergeCells('M4:N5');
    worksheet.getCell('M4').value = years[1];
    worksheet.getCell('M4').alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };

    worksheet.mergeCells('M6:M8');
    worksheet.getCell('M6').value = `${t('Crop')} 1`;
    worksheet.getCell('M6').alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };

    worksheet.mergeCells('N6:N8');
    worksheet.getCell('N6').value = `${t('Crop')} 2`;
    worksheet.getCell('N6').alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };

    worksheet.mergeCells('O4:P5');
    worksheet.getCell('O4').value = t('Planting Time');
    worksheet.getCell('O4').alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };

    worksheet.mergeCells('O6:O8');
    worksheet.getCell('O6').value = `${t('Crop')} 1`;
    worksheet.getCell('O6').alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };

    worksheet.mergeCells('P6:P8');
    worksheet.getCell('P6').value = `${t('Crop')} 2`;
    worksheet.getCell('P6').alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };

    worksheet.mergeCells('Q4:Q8');
    worksheet.getCell('Q4').value = t('Standard');

    worksheet.mergeCells('R4:R8');
    worksheet.getCell('R4').value = t('Organic Transition Date');

    worksheet.mergeCells('S4:T5');
    worksheet.getCell('S4').value = `${years[2]} (${t('planned')})`;
    worksheet.getCell('S4').alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };

    worksheet.mergeCells('S6:S8');
    worksheet.getCell('S6').value = `${t('Crop')} 1`;
    worksheet.getCell('S6').alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };

    worksheet.mergeCells('T6:T8');
    worksheet.getCell('T6').value = `${t('Crop')} 2`;
    worksheet.getCell('T6').alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };

    worksheet.mergeCells('U4:V5');
    worksheet.getCell('U4').value = `${years[3]} (${t('planned')}})`;
    worksheet.getCell('U4').alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };

    worksheet.mergeCells('U6:U8');
    worksheet.getCell('U6').value = `${t('Crop')} 1`;
    worksheet.getCell('U6').alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };

    worksheet.mergeCells('V6:V8');
    worksheet.getCell('V6').value = `${t('Crop')} 2`;
    worksheet.getCell('V6').alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };

    worksheet.mergeCells('W4:X5');
    worksheet.getCell('W4').value = `${years[4]} (${t('planned')})`;
    worksheet.getCell('W4').alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };

    worksheet.mergeCells('W6:W8');
    worksheet.getCell('W6').value = `${t('Crop')} 1`;
    worksheet.getCell('W6').alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };

    worksheet.mergeCells('X6:X8');
    worksheet.getCell('X6').value = `${t('Crop')} 2`;
    worksheet.getCell('X6').alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };

    landParcels.forEach((parcel, index) => {
      // previous year
      const parcelCropsPY = parcel.crops
        .filter((crop) => {
          return crop.year === years[0];
        })
        .flat();

      // group by quarter
      const groupedParcelCropsPY = groupBy(parcelCropsPY, 'order');

      // current year
      const parcelCropsCY = parcel.crops.filter((crop) => {
        return crop.year === years[1];
      });

      const groupedParcelCropsCY = groupBy(parcelCropsCY, 'order');

      const parcelCropsY1 = parcel.crops.filter((crop) => {
        return crop.year === years[2];
      });

      const groupedParcelCropsY1 = groupBy(parcelCropsY1, 'order');

      const parcelCropsY2 = parcel.crops.filter((crop) => {
        return crop.year === years[3];
      });

      const groupedParcelCropsY2 = groupBy(parcelCropsY2, 'order');

      const parcelCropsY3 = parcel.crops.filter((crop) => {
        return crop.year === years[4];
      });

      const groupedParcelCropsY3 = groupBy(parcelCropsY3, 'order');

      const maxRows = (parcel.subParcels.length || 1) - 1;

      let currentRowIndex = worksheet.rowCount;

      currentRowIndex = currentRowIndex + 1;

      worksheet.getCell(`A${currentRowIndex}`).value = index + 1;
      worksheet.getCell(`B${currentRowIndex}`).value = parcel.code;
      worksheet.getCell(`C${currentRowIndex}`).value = parcel.cadastral_no;
      worksheet.getCell(`D${currentRowIndex}`).value = parcel.location;
      worksheet.getCell(`E${currentRowIndex}`).value = t(
        parcel.ownership_status,
      );
      worksheet.getCell(`F${currentRowIndex}`).value =
        parcel.contract_start_date
          ? format(new Date(parcel.contract_start_date), 'dd.MM.yyyy')
          : '';
      worksheet.getCell(`G${currentRowIndex}`).value = parcel.contract_end_date
        ? format(new Date(parcel.contract_end_date), 'dd.MM.yyyy')
        : '';
      worksheet.getCell(`H${currentRowIndex}`).value = parcel.total_area;
      worksheet.getCell(`J${currentRowIndex}`).value = parcel.buffer_zone;
      worksheet.getCell(`Q${currentRowIndex}`).value = parcel.applied_standards;
      worksheet.getCell(`R${currentRowIndex}`).value =
        parcel.organic_transition_date
          ? format(new Date(parcel.organic_transition_date), 'dd.MM.yyyy')
          : '';

      if (maxRows > 0) {
        worksheet.mergeCells(
          `A${currentRowIndex}:A${currentRowIndex + maxRows}`,
        );
        worksheet.mergeCells(
          `B${currentRowIndex}:B${currentRowIndex + maxRows}`,
        );
        worksheet.mergeCells(
          `C${currentRowIndex}:C${currentRowIndex + maxRows}`,
        );
        worksheet.mergeCells(
          `D${currentRowIndex}:D${currentRowIndex + maxRows}`,
        );
        worksheet.mergeCells(
          `E${currentRowIndex}:E${currentRowIndex + maxRows}`,
        );
        worksheet.mergeCells(
          `F${currentRowIndex}:F${currentRowIndex + maxRows}`,
        );
        worksheet.mergeCells(
          `G${currentRowIndex}:G${currentRowIndex + maxRows}`,
        );
        worksheet.mergeCells(
          `H${currentRowIndex}:H${currentRowIndex + maxRows}`,
        );
        worksheet.mergeCells(
          `J${currentRowIndex}:J${currentRowIndex + maxRows}`,
        );
        worksheet.mergeCells(
          `Q${currentRowIndex}:Q${currentRowIndex + maxRows}`,
        );
        worksheet.mergeCells(
          `R${currentRowIndex}:R${currentRowIndex + maxRows}`,
        );
      }

      parcel.subParcels.forEach((subParcel, index) => {
        worksheet.getCell(`I${currentRowIndex + index}`).value = subParcel.area;
      });

      Object.keys(groupedParcelCropsPY).forEach((quarter, qIdx) => {
        const crops = groupedParcelCropsPY[quarter];

        this.addCropRow(
          worksheet,
          qIdx === 0 ? 'K' : 'L',
          crops,
          qIdx === 0 ? currentRowIndex : currentRowIndex + 1,
          language,
        );
      });

      Object.keys(groupedParcelCropsCY).forEach((quarter, qIdx) => {
        const crops = groupedParcelCropsCY[quarter];

        this.addCropRow(
          worksheet,
          qIdx === 0 ? 'M' : 'N',
          crops,
          qIdx === 0 ? currentRowIndex : currentRowIndex + 1,
          language,
        );

        crops.forEach((crop, index) => {
          const colLetter = qIdx === 0 ? 'O' : 'P';
          const subParcelIndex = qIdx === 0 ? 0 : 1;

          worksheet.getCell(
            `${colLetter}${currentRowIndex + index + subParcelIndex}`,
          ).value = crop.planting_date;
        });
      });

      Object.keys(groupedParcelCropsY1).forEach((quarter, qIdx) => {
        const crops = groupedParcelCropsY1[quarter];

        this.addCropRow(
          worksheet,
          qIdx === 0 ? 'S' : 'T',
          crops,
          qIdx === 0 ? currentRowIndex : currentRowIndex + 1,
          language,
        );
      });

      Object.keys(groupedParcelCropsY2).forEach((quarter, qIdx) => {
        const crops = groupedParcelCropsY2[quarter];

        this.addCropRow(
          worksheet,
          qIdx === 0 ? 'U' : 'V',
          crops,
          qIdx === 0 ? currentRowIndex : currentRowIndex + 1,
          language,
        );
      });

      Object.keys(groupedParcelCropsY3).forEach((quarter, qIdx) => {
        const crops = groupedParcelCropsY3[quarter];

        this.addCropRow(
          worksheet,
          qIdx === 0 ? 'W' : 'X',
          crops,
          qIdx === 0 ? currentRowIndex : currentRowIndex + 1,
          language,
        );
      });

      for (let i = 0; i <= maxRows; i++) {
        this.addBorder(worksheet, currentRowIndex + i, 'A', 'X');
      }
    });

    this.setAlignment(worksheet);
    this.setBgForHeader(worksheet);

    this.addBorder(worksheet, 8, 'F', 'G');
    this.addBgColor(worksheet, 8, 'F', 'G', 'FFD9D9D9');
    this.setBold(worksheet, 8);

    this.addBorder(worksheet, 6, 'K', 'P');
    this.addBgColor(worksheet, 6, 'K', 'P', 'FFD9D9D9');

    [4, 6].forEach((rowIndex) => {
      this.addBgColor(worksheet, rowIndex, 'K', 'L', 'D9E1F2');
      this.addBgColor(worksheet, rowIndex, 'S', 'X', 'D9E1F2');
    });

    this.setBold(worksheet, 6);

    this.addBorder(worksheet, 6, 'S', 'X');

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

  private addCropRow(
    worksheet: ExcelJS.Worksheet,
    column: string,
    quarterCrops: any,
    rowIndex: number,
    lan: Language,
  ) {
    quarterCrops.forEach((crop, index) => {
      worksheet.getCell(`${column}${rowIndex + index}`).value = crop
        ? ta(crop.crop, 'name', lan)
        : '';
    });
  }
}
