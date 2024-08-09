import { Injectable } from '@nestjs/common';
import { FarmActivity, ActivityType } from '../activities/farm-activity.entity';
import { Xlsx } from '../../abstracts/xlsx';
import { Language } from '../../localization';
import { ta } from '../../utils/localized_attribute';
import * as ExcelJS from 'exceljs';
import { CodeCategoryService } from '../code-categories/code-category.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const format = require('date-fns/format');

@Injectable()
export class FarmActivityXlsxService extends Xlsx<FarmActivity> {
  constructor(private readonly cropCategoryService: CodeCategoryService) {
    super();
  }

  private _generateXlsxColumns(
    workbook: ExcelJS.Workbook,
    type: ActivityType,
    worksheetName: string,
    t: any,
  ) {
    const worksheet = workbook.addWorksheet(worksheetName);

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

    // Common attributes
    worksheet.mergeCells('B4:B8');
    worksheet.getCell('B4').value = t('Date');

    // title
    worksheet.mergeCells('B2:Y2');
    worksheet.getCell('B2').value = worksheetName;

    if (type === ActivityType.HARVESTING) {
      worksheet.mergeCells('C4:C8');
      worksheet.getCell('C4').value = t('Time Spent');

      worksheet.mergeCells('D4:D8');
      worksheet.getCell('D4').value = t('Land Parcel');

      worksheet.mergeCells('E4:E8');
      worksheet.getCell('E4').value = t('Location');

      worksheet.mergeCells('F4:F8');
      worksheet.getCell('F4').value = t('Crop');

      worksheet.mergeCells('G4:G8');
      worksheet.getCell('G4').value = t('Part Of Crop');

      worksheet.mergeCells('H4:H8');
      worksheet.getCell('H4').value = t('Harvesting Quantity');

      worksheet.mergeCells('I4:I8');
      worksheet.getCell('I4').value = t('Packaging Type');

      worksheet.mergeCells('J4:K8');
      worksheet.getCell('J4').value = t('Comments');

      return worksheet;
    }

    if (type === ActivityType.MILLING) {
      worksheet.mergeCells('C4:C8');
      worksheet.getCell('C4').value = t('Time Spent');

      worksheet.mergeCells('D4:D8');
      worksheet.getCell('D4').value = t('Land Parcel');

      worksheet.mergeCells('E4:E8');
      worksheet.getCell('E4').value = t('Location');

      worksheet.mergeCells('F4:H8');
      worksheet.getCell('F4').value = t('Fuel Used');

      worksheet.mergeCells('I4:J8');
      worksheet.getCell('I4').value = t('Cost');

      worksheet.mergeCells('K4:L8');
      worksheet.getCell('K4').value = t('Comments');

      return worksheet;
    }

    if (type === ActivityType.IRRIGATION) {
      worksheet.mergeCells('C4:C8');
      worksheet.getCell('C4').value = t('Time Spent');

      worksheet.mergeCells('D4:D8');
      worksheet.getCell('D4').value = t('Land Parcel');

      worksheet.mergeCells('E4:E8');
      worksheet.getCell('E4').value = t('Location');

      worksheet.mergeCells('F4:F8');
      worksheet.getCell('F4').value = t('Irrigation Method');

      worksheet.mergeCells('G4:G8');
      worksheet.getCell('G4').value = t('Frequency');

      worksheet.mergeCells('H4:H8');
      worksheet.getCell('H4').value = t('Frequency Unit');

      worksheet.mergeCells('I4:I8');
      worksheet.getCell('I4').value = t('Source');

      worksheet.mergeCells('J4:K8');
      worksheet.getCell('J4').value = t('Comments');

      return worksheet;
    }

    if (type === ActivityType.FERTILIZATION) {
      worksheet.mergeCells('C4:C8');
      worksheet.getCell('C4').value = t('Land Parcel');

      worksheet.mergeCells('D4:D8');
      worksheet.getCell('D4').value = t('Location');

      worksheet.mergeCells('E4:E8');
      worksheet.getCell('E4').value = t('Product');

      worksheet.mergeCells('F4:F8');
      worksheet.getCell('F4').value = t('Type');

      worksheet.mergeCells('G4:G8');
      worksheet.getCell('G4').value = t('Origin');

      worksheet.mergeCells('H4:H8');
      worksheet.getCell('H4').value = t('Sub type');

      worksheet.mergeCells('I4:I8');
      worksheet.getCell('I4').value = t('Producer');

      worksheet.mergeCells('J4:J8');
      worksheet.getCell('J4').value = t('Supplier');

      worksheet.mergeCells('K4:K8');
      worksheet.getCell('K4').value = t('Applied Quantity');

      worksheet.mergeCells('L4:L8');
      worksheet.getCell('L4').value = t('Remaining Quantity');

      worksheet.mergeCells('M4:M8');
      worksheet.getCell('M4').value = t('Nitrogen Quantity');

      worksheet.mergeCells('N4:O8');
      worksheet.getCell('N4').value = t('Devices');

      worksheet.mergeCells('P4:Q8');
      worksheet.getCell('P4').value = t('Fuel Used');

      worksheet.mergeCells('R4:S8');
      worksheet.getCell('R4').value = t('Comments');

      return worksheet;
    }

    if (type === ActivityType.SEED_PLANTING) {
      worksheet.mergeCells('C4:C8');
      worksheet.getCell('C4').value = t('Time Spent');

      worksheet.mergeCells('D4:D8');
      worksheet.getCell('D4').value = t('Land Parcel');

      worksheet.mergeCells('E4:E8');
      worksheet.getCell('E4').value = t('Location');

      worksheet.mergeCells('F4:F8');
      worksheet.getCell('F4').value = t('Crop');

      worksheet.mergeCells('G4:G8');
      worksheet.getCell('G4').value = t('Material Type');

      worksheet.mergeCells('H4:H8');
      worksheet.getCell('H4').value = t('Origin');

      worksheet.mergeCells('I4:I8');
      worksheet.getCell('I4').value = t('Status');

      worksheet.mergeCells('J4:J8');
      worksheet.getCell('J4').value = t('Distance');

      worksheet.mergeCells('K4:K8');
      worksheet.getCell('K4').value = t('Applied Quantity');

      worksheet.mergeCells('L4:L8');
      worksheet.getCell('L4').value = t('Type');

      worksheet.mergeCells('M4:M8');
      worksheet.getCell('M4').value = t('Remaining Quantity');

      worksheet.mergeCells('N4:N8');
      worksheet.getCell('N4').value = t('Persons');

      worksheet.mergeCells('O4:P8');
      worksheet.getCell('O4').value = t('Devices');

      worksheet.mergeCells('Q4:R8');
      worksheet.getCell('Q4').value = t('Fuel Used');

      worksheet.mergeCells('S4:T8');
      worksheet.getCell('S4').value = t('Comments');

      return worksheet;
    }

    if (type === ActivityType.SOIL_ANALYSIS) {
      worksheet.mergeCells('C4:C8');
      worksheet.getCell('C4').value = t('Land Parcel');

      worksheet.mergeCells('D4:D8');
      worksheet.getCell('D4').value = t('Location');

      worksheet.mergeCells('E4:E8');
      worksheet.getCell('E4').value = t('pH Level');

      worksheet.mergeCells('F4:F8');
      worksheet.getCell('F4').value = t('N Level');

      worksheet.mergeCells('G4:G8');
      worksheet.getCell('G4').value = t('P Level');

      worksheet.mergeCells('H4:H8');
      worksheet.getCell('H4').value = t('K Level');

      worksheet.mergeCells('I4:J8');
      worksheet.getCell('I4').value = t('Document');

      worksheet.mergeCells('K4:L8');
      worksheet.getCell('K4').value = t('Comments');

      return worksheet;
    }

    if (type === ActivityType.LAND_PLOUGHING) {
      worksheet.mergeCells('C4:C8');
      worksheet.getCell('C4').value = t('Time Spent');

      worksheet.mergeCells('D4:D8');
      worksheet.getCell('D4').value = t('Land Parcel');

      worksheet.mergeCells('E4:E8');
      worksheet.getCell('E4').value = t('Location');

      worksheet.mergeCells('F4:G8');
      worksheet.getCell('F4').value = t('Depth');

      worksheet.mergeCells('H4:I8');
      worksheet.getCell('H4').value = t('Devices');

      worksheet.mergeCells('J4:K8');
      worksheet.getCell('J4').value = t('Fuel Used');

      worksheet.mergeCells('L4:M8');
      worksheet.getCell('M4').value = t('Cost');

      worksheet.mergeCells('N4:O8');
      worksheet.getCell('N4').value = t('Comments');

      return worksheet;
    }

    if (type === ActivityType.BED_PREPARATION) {
      worksheet.mergeCells('C4:C8');
      worksheet.getCell('C4').value = t('Time Spent');

      worksheet.mergeCells('D4:D8');
      worksheet.getCell('D4').value = t('Land Parcel');

      worksheet.mergeCells('E4:E8');
      worksheet.getCell('E4').value = t('Location');

      worksheet.mergeCells('F4:H8');
      worksheet.getCell('F4').value = t('Fuel Used');

      worksheet.mergeCells('I4:J8');
      worksheet.getCell('I4').value = t('Cost');

      worksheet.mergeCells('K4:L8');
      worksheet.getCell('K4').value = t('Comments');

      return worksheet;
    }

    if (type === ActivityType.CROP_PROTECTION) {
      worksheet.mergeCells('C4:C8');
      worksheet.getCell('C4').value = t('Time Spent');

      worksheet.mergeCells('D4:D8');
      worksheet.getCell('D4').value = t('Land Parcel');

      worksheet.mergeCells('E4:E8');
      worksheet.getCell('E4').value = t('Location');

      worksheet.mergeCells('F4:F8');
      worksheet.getCell('F4').value = t('Crop');

      worksheet.mergeCells('G4:I8');
      worksheet.getCell('G4').value = t('Disease');

      worksheet.mergeCells('J4:J8');
      worksheet.getCell('J4').value = t('Active Ingredient');

      worksheet.mergeCells('K4:K8');
      worksheet.getCell('K4').value = t('Supplier');

      worksheet.mergeCells('L4:L8');
      worksheet.getCell('L4').value = t('Applied Quantity');

      worksheet.mergeCells('M4:M8');
      worksheet.getCell('M4').value = t('Copper Quantity');

      worksheet.mergeCells('N4:N8');
      worksheet.getCell('N4').value = t('Remaining Quantity');

      worksheet.mergeCells('O4:P8');
      worksheet.getCell('P4').value = t('Comments');

      return worksheet;
    }

    if (type === ActivityType.GRAZING_MANAGEMENT) {
      worksheet.mergeCells('C4:C8');
      worksheet.getCell('C4').value = t('Time Spent');

      worksheet.mergeCells('D4:D8');
      worksheet.getCell('D4').value = t('Land Parcel');

      worksheet.mergeCells('E4:E8');
      worksheet.getCell('E4').value = t('Location');

      worksheet.mergeCells('F4:F8');
      worksheet.getCell('F4').value = t('Type');

      worksheet.mergeCells('G4:G8');
      worksheet.getCell('G4').value = t('Persons');

      worksheet.mergeCells('H4:I8');
      worksheet.getCell('H4').value = t('Devices');

      worksheet.mergeCells('J4:K8');
      worksheet.getCell('J4').value = t('Fuel Used');

      worksheet.mergeCells('L4:M8');
      worksheet.getCell('L4').value = t('Comments');

      return worksheet;
    }
  }

  public async export(
    farmActivities: FarmActivity[],
    language: Language = 'sq',
  ) {
    const workbook = new ExcelJS.Workbook();
    const { t } = this.translations(language);

    const activities: { [key in ActivityType]: FarmActivity[] } = {
      harvesting: [],
      soil_analysis: [],
      milling: [],
      bed_preparation: [],
      crop_protection: [],
      irrigation: [],
      fertilization: [],
      grazing_management: [],
      land_ploughing: [],
      seed_planting: [],
    };

    for (let i = 0; i < farmActivities.length; i++) {
      const activity = farmActivities[i];

      activities[activity.activity_type].push(activity);
    }

    const harvesting_worksheet = this._generateXlsxColumns(
      workbook,
      ActivityType.HARVESTING,
      t('Harvesting Activities'),
      t,
    );

    const milling_worksheet = this._generateXlsxColumns(
      workbook,
      ActivityType.MILLING,
      t('Milling Activities'),
      t,
    );

    const seed_planting_worksheet = this._generateXlsxColumns(
      workbook,
      ActivityType.SEED_PLANTING,
      t('Seed Planting Activities'),
      t,
    );

    const bed_preparation_worksheet = this._generateXlsxColumns(
      workbook,
      ActivityType.BED_PREPARATION,
      t('Bed Preparation Activities'),
      t,
    );

    const land_ploughing_worksheet = this._generateXlsxColumns(
      workbook,
      ActivityType.LAND_PLOUGHING,
      t('Land Ploughing Activities'),
      t,
    );

    const irrigation_worksheet = this._generateXlsxColumns(
      workbook,
      ActivityType.IRRIGATION,
      t('Irrigation Activities'),
      t,
    );

    const fertilization_worksheet = this._generateXlsxColumns(
      workbook,
      ActivityType.FERTILIZATION,
      t('Fertilization Activities'),
      t,
    );

    const soil_analysis_worksheet = this._generateXlsxColumns(
      workbook,
      ActivityType.SOIL_ANALYSIS,
      t('Soil Analysis Activities'),
      t,
    );

    const grazing_management_worksheet = this._generateXlsxColumns(
      workbook,
      ActivityType.GRAZING_MANAGEMENT,
      t('Grazing Management Activities'),
      t,
    );

    const crop_protection_worksheet = this._generateXlsxColumns(
      workbook,
      ActivityType.CROP_PROTECTION,
      t('Crop Protection Activities'),
      t,
    );

    this.setBgForHeader(harvesting_worksheet, 10);
    this.setBgForHeader(crop_protection_worksheet, 15);
    this.setBgForHeader(grazing_management_worksheet, 13);
    this.setBgForHeader(soil_analysis_worksheet, 11);
    this.setBgForHeader(fertilization_worksheet, 19);
    this.setBgForHeader(irrigation_worksheet, 11);
    this.setBgForHeader(land_ploughing_worksheet, 15);
    this.setBgForHeader(bed_preparation_worksheet, 11);
    this.setBgForHeader(seed_planting_worksheet, 20);
    this.setBgForHeader(milling_worksheet, 11);

    const diseases =
      await this.cropCategoryService.findByApiName('CROP_DISEASES');

    activities.harvesting.forEach((activity: any, index: number) => {
      const rowIndex = harvesting_worksheet.rowCount + 1;
      const newRow = harvesting_worksheet.getRow(rowIndex);

      harvesting_worksheet.mergeCells(`J${rowIndex}:K${rowIndex}`);

      newRow.getCell('A').value = index + 1;
      newRow.getCell('B').value = format(new Date(activity.date), 'dd.MM.yyyy');
      newRow.getCell('C').value = this.timespentFormat(activity.time_spent);
      newRow.getCell('D').value = activity.landParcel.code;
      newRow.getCell('E').value = activity.landParcel.location;
      newRow.getCell('F').value = ta(activity.crop, 'name', language);
      newRow.getCell('G').value = ta(activity.partOfCrop, 'name', language);
      newRow.getCell('H').value = activity.quantity;
      newRow.getCell('I').value = activity.details.packaging_type;
      newRow.getCell('J').value = activity.comments;

      this.addBorder(harvesting_worksheet, rowIndex, 'A', 'K');

      newRow.commit();
    });

    activities.crop_protection.forEach((activity: any, index: number) => {
      const rowIndex = crop_protection_worksheet.rowCount + 1;
      const newRow = crop_protection_worksheet.getRow(rowIndex);

      crop_protection_worksheet.mergeCells(`G${rowIndex}:I${rowIndex}`);
      crop_protection_worksheet.mergeCells(`O${rowIndex}:P${rowIndex}`);

      newRow.getCell('A').value = index + 1;
      newRow.getCell('B').value = format(new Date(activity.date), 'dd.MM.yyyy');
      newRow.getCell('C').value = this.timespentFormat(activity.time_spent);
      newRow.getCell('D').value = activity.landParcel.code;
      newRow.getCell('E').value = activity.landParcel.location;
      newRow.getCell('F').value = ta(activity.crop, 'name', language);
      newRow.getCell('G').value = ta(
        diseases.codes.find(
          (disease) => disease.id === activity.details.disease_id,
        ),
        'name',
        language,
      );
      newRow.getCell('J').value = activity.details.active_ingredient;
      newRow.getCell('K').value = activity.details.supplier?.name || '';
      newRow.getCell('L').value = activity.quantity;
      newRow.getCell('M').value = activity.details.cu_quantity;
      newRow.getCell('N').value = activity.details.remaining_quantity;
      newRow.getCell('O').value = activity.comments;

      this.addBorder(crop_protection_worksheet, rowIndex, 'A', 'P');

      newRow.commit();
    });

    activities.irrigation.forEach((activity: any, index: number) => {
      const rowIndex = irrigation_worksheet.rowCount + 1;
      const newRow = irrigation_worksheet.getRow(rowIndex);

      irrigation_worksheet.mergeCells(`J${rowIndex}:K${rowIndex}`);

      newRow.getCell('A').value = index + 1;
      newRow.getCell('B').value = format(new Date(activity.date), 'dd.MM.yyyy');
      newRow.getCell('C').value = this.timespentFormat(activity.time_spent);
      newRow.getCell('D').value = activity.landParcel.code;
      newRow.getCell('E').value = activity.landParcel.location;
      newRow.getCell('F').value = t(activity.details.method);
      newRow.getCell('G').value = activity.details.frequency;
      newRow.getCell('H').value = t(activity.details.frequency_unit);
      newRow.getCell('I').value = t(activity.details.source);
      newRow.getCell('J').value = activity.comments;

      this.addBorder(irrigation_worksheet, rowIndex, 'A', 'K');

      newRow.commit();
    });

    activities.soil_analysis.forEach((activity: any, index: number) => {
      const rowIndex = soil_analysis_worksheet.rowCount + 1;
      const newRow = soil_analysis_worksheet.getRow(rowIndex);

      soil_analysis_worksheet.mergeCells(`I${rowIndex}:J${rowIndex}`);
      soil_analysis_worksheet.mergeCells(`K${rowIndex}:L${rowIndex}`);

      newRow.getCell('A').value = index + 1;
      newRow.getCell('B').value = format(new Date(activity.date), 'dd.MM.yyyy');
      newRow.getCell('C').value = activity.landParcel.code;
      newRow.getCell('D').value = activity.landParcel.location;
      newRow.getCell('E').value = activity.details.ph_level;
      newRow.getCell('F').value = activity.details.n_level;
      newRow.getCell('G').value = activity.details.p_level;
      newRow.getCell('H').value = activity.details.k_level;
      newRow.getCell('I').value = activity.file
        ? {
            text: t('Open Document'),
            hyperlink: activity.file,
          }
        : '';
      newRow.getCell('K').value = activity.comments;

      this.addBorder(soil_analysis_worksheet, rowIndex, 'A', 'L');

      newRow.commit();
    });

    activities.fertilization.forEach((activity: any, index: number) => {
      const rowIndex = fertilization_worksheet.rowCount + 1;
      const newRow = fertilization_worksheet.getRow(rowIndex);

      fertilization_worksheet.mergeCells(`N${rowIndex}:O${rowIndex}`);
      fertilization_worksheet.mergeCells(`P${rowIndex}:Q${rowIndex}`);
      fertilization_worksheet.mergeCells(`R${rowIndex}:S${rowIndex}`);

      newRow.getCell('A').value = index + 1;
      newRow.getCell('B').value = format(new Date(activity.date), 'dd.MM.yyyy');
      newRow.getCell('C').value = activity.landParcel.code;
      newRow.getCell('D').value = activity.landParcel.location;
      newRow.getCell('E').value = activity.details.product?.name || '';
      newRow.getCell('F').value = t(activity.details.type);
      newRow.getCell('G').value = t(activity.details.origin);
      newRow.getCell('H').value = t(activity.details.subtype);
      newRow.getCell('I').value = activity.details.producer?.name || '';
      newRow.getCell('J').value = activity.details.supplier?.name || '';
      newRow.getCell('K').value = activity.quantity;
      newRow.getCell('L').value = activity.details.remaining_quantity;
      newRow.getCell('M').value = activity.details.n_quantity;
      newRow.getCell('N').value =
        activity.details?.devices?.map((dev: any) => dev?.name).join(', ') ||
        '';
      newRow.getCell('P').value = activity.details.fuel_used;
      newRow.getCell('R').value = activity.comments;

      this.addBorder(fertilization_worksheet, rowIndex, 'A', 'R');

      newRow.commit();
    });

    activities.grazing_management.forEach((activity: any, index: number) => {
      const rowIndex = grazing_management_worksheet.rowCount + 1;
      const newRow = grazing_management_worksheet.getRow(rowIndex);

      grazing_management_worksheet.mergeCells(`H${rowIndex}:I${rowIndex}`);
      grazing_management_worksheet.mergeCells(`J${rowIndex}:K${rowIndex}`);
      grazing_management_worksheet.mergeCells(`L${rowIndex}:M${rowIndex}`);

      newRow.getCell('A').value = index + 1;
      newRow.getCell('B').value = format(new Date(activity.date), 'dd.MM.yyyy');
      newRow.getCell('C').value = this.timespentFormat(activity.time_spent);
      newRow.getCell('D').value = activity.landParcel.code;
      newRow.getCell('E').value = activity.landParcel.location;
      newRow.getCell('F').value = t(activity.details.type);
      newRow.getCell('G').value = activity.details.persons;
      newRow.getCell('H').value =
        activity.details?.devices?.map((dev: any) => dev.name).join(', ') || '';
      newRow.getCell('J').value = activity.details.fuel_used;
      newRow.getCell('L').value = activity.comments;

      this.addBorder(grazing_management_worksheet, rowIndex, 'A', 'M');

      newRow.commit();
    });

    activities.milling.forEach((activity: any, index: number) => {
      const rowIndex = milling_worksheet.rowCount + 1;
      const newRow = milling_worksheet.getRow(rowIndex);

      milling_worksheet.mergeCells(`F${rowIndex}:H${rowIndex}`);
      milling_worksheet.mergeCells(`I${rowIndex}:J${rowIndex}`);
      milling_worksheet.mergeCells(`K${rowIndex}:L${rowIndex}`);

      newRow.getCell('A').value = index + 1;
      newRow.getCell('B').value = format(new Date(activity.date), 'dd.MM.yyyy');
      newRow.getCell('C').value = this.timespentFormat(activity.time_spent);
      newRow.getCell('D').value = activity.landParcel.code;
      newRow.getCell('E').value = activity.landParcel.location;
      newRow.getCell('F').value = activity.quantity;
      newRow.getCell('I').value = activity.cost;
      newRow.getCell('K').value = activity.comments;

      this.addBorder(milling_worksheet, rowIndex, 'A', 'K');

      newRow.commit();
    });

    activities.bed_preparation.forEach((activity: any, index: number) => {
      const rowIndex = bed_preparation_worksheet.rowCount + 1;
      const newRow = bed_preparation_worksheet.getRow(rowIndex);

      bed_preparation_worksheet.mergeCells(`F${rowIndex}:H${rowIndex}`);
      bed_preparation_worksheet.mergeCells(`I${rowIndex}:J${rowIndex}`);
      bed_preparation_worksheet.mergeCells(`K${rowIndex}:L${rowIndex}`);

      newRow.getCell('A').value = index + 1;
      newRow.getCell('B').value = format(new Date(activity.date), 'dd.MM.yyyy');
      newRow.getCell('C').value = this.timespentFormat(activity.time_spent);
      newRow.getCell('D').value = activity.landParcel.code;
      newRow.getCell('E').value = activity.landParcel.location;
      newRow.getCell('F').value = activity.quantity;
      newRow.getCell('I').value = activity.cost;
      newRow.getCell('K').value = activity.comments;

      this.addBorder(bed_preparation_worksheet, rowIndex, 'A', 'L');

      newRow.commit();
    });

    activities.seed_planting.forEach((activity: any, index: number) => {
      const rowIndex = seed_planting_worksheet.rowCount + 1;
      const newRow = seed_planting_worksheet.getRow(rowIndex);
      console.log(activity);

      seed_planting_worksheet.mergeCells(`O${rowIndex}:P${rowIndex}`);
      seed_planting_worksheet.mergeCells(`Q${rowIndex}:R${rowIndex}`);
      seed_planting_worksheet.mergeCells(`S${rowIndex}:T${rowIndex}`);

      newRow.getCell('A').value = index + 1;
      newRow.getCell('B').value = format(new Date(activity.date), 'dd.MM.yyyy');
      newRow.getCell('C').value = this.timespentFormat(activity.time_spent);
      newRow.getCell('D').value = activity.landParcel.code;
      newRow.getCell('E').value = activity.landParcel.location;
      newRow.getCell('F').value = ta(activity.crop, 'name', language);
      newRow.getCell('G').value = t(activity.details.material_type);
      newRow.getCell('H').value = t(activity.details.material_origin);
      newRow.getCell('I').value = t(activity.details.status);
      newRow.getCell('J').value = activity.details.distance;
      newRow.getCell('K').value = activity.quantity;
      newRow.getCell('L').value = t(activity.details.type);
      newRow.getCell('M').value = activity.details.remaining_quantity;
      newRow.getCell('N').value = activity.details.persons;
      newRow.getCell('O').value =
        activity.details?.devices?.map((dev: any) => dev?.name).join(', ') ||
        '';
      newRow.getCell('Q').value = activity.details.fuel_used;
      newRow.getCell('S').value = activity.comments;

      this.addBorder(seed_planting_worksheet, rowIndex, 'A', 'T');

      newRow.commit();
    });

    activities.land_ploughing.forEach((activity: any, index: number) => {
      const rowIndex = land_ploughing_worksheet.rowCount + 1;
      const newRow = land_ploughing_worksheet.getRow(rowIndex);

      land_ploughing_worksheet.mergeCells(`F${rowIndex}:G${rowIndex}`);
      land_ploughing_worksheet.mergeCells(`H${rowIndex}:I${rowIndex}`);
      land_ploughing_worksheet.mergeCells(`J${rowIndex}:K${rowIndex}`);
      land_ploughing_worksheet.mergeCells(`L${rowIndex}:M${rowIndex}`);
      land_ploughing_worksheet.mergeCells(`N${rowIndex}:O${rowIndex}`);

      newRow.getCell('A').value = index + 1;
      newRow.getCell('B').value = format(new Date(activity.date), 'dd.MM.yyyy');
      newRow.getCell('C').value = this.timespentFormat(activity.time_spent);
      newRow.getCell('D').value = activity.landParcel.code;
      newRow.getCell('E').value = activity.landParcel.location;
      newRow.getCell('F').value = activity.details.depth;
      newRow.getCell('H').value =
        activity.details?.devices?.map((dev: any) => dev?.name).join(', ') ||
        '';
      newRow.getCell('J').value = activity.quantity;
      newRow.getCell('L').value = activity.cost;
      newRow.getCell('N').value = activity.comments;

      this.addBorder(land_ploughing_worksheet, rowIndex, 'A', 'O');

      newRow.commit();
    });

    workbook.eachSheet((worksheet) => {
      worksheet.columns.forEach((column) => {
        column.alignment = {
          vertical: 'middle',
          horizontal: 'center',
          wrapText: true,
        };
      });

      const header = worksheet.getRow(2);
      header.alignment = {
        horizontal: 'left',
        vertical: 'middle',
      };
      header.font = { bold: true };
      worksheet.pageSetup.printArea = 'A1:Y100';
      worksheet.pageSetup.orientation = 'landscape';
      worksheet.pageSetup.fitToPage = true;
      worksheet.pageSetup.fitToWidth = 1;
      worksheet.pageSetup.fitToHeight = 5;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }

  private timespentFormat(value: string | number): string {
    const hours = Math.floor(+value / 60);
    const minutes = +value % 60;

    const formatH = hours < 10 ? `0${hours}` : hours;
    const formatM = minutes < 10 ? `0${minutes}` : minutes;

    return `${formatH}:${formatM}`;
  }
}
