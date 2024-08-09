import { IsDateString, IsNotEmpty, IsEnum } from 'class-validator';
import { Zone } from '../members/zone.entity';
import { Code } from '../code-categories/code.entity';
import { CropState, CropStatus } from '../activities/types';
import { ProcessingType } from '../activities/processing-activity.entity';

export class ProcessingActivityDto {
  id: number;
  admission_no: string;
  crop: Code;
  partOfCrop: Code;
  processing_method: Code;
  processing_type: ProcessingType;
  processing_unit: Code;
  date: string;
  crop_state: CropState;
  crop_status: CropStatus;
  gross_quantity: number;
  net_quantity: number;
  firo: number;
  notes: string;
  lot_code: string;
  zone: Zone;
  admission_id: number;
  admission_entry_id: number;
  drier_number?: string;
  drier_temp?: number;
  drier_start_hour?: number;
  drier_end_hour?: number;
  drying_start_date?: Date;
  drying_end_date?: Date;
}

export class Entry {
  @IsNotEmpty()
  admission_id: number;

  @IsNotEmpty()
  admission_entry_id: number;

  gross_quantity: number;

  @IsNotEmpty()
  crop_id: number;

  @IsNotEmpty()
  @IsEnum(CropState)
  cropState: CropState;

  @IsNotEmpty()
  @IsEnum(CropStatus)
  cropStatus: CropStatus;

  @IsNotEmpty()
  part_of_crop_id: number;

  net_quantity: number;

  drier_number?: string;

  @IsNotEmpty()
  inventory_item_id: number;

  firo: number;

  fraction: string;
}

export class NewProcessingActivityEntryDto {
  @IsNotEmpty()
  @IsDateString()
  date: string;

  processing_method_id: number;

  @IsNotEmpty()
  processing_type: ProcessingType;

  @IsNotEmpty()
  processing_unit_id: number;

  notes: string;

  @IsNotEmpty()
  lot_code: string;

  drier_number?: string;

  drier_temp?: number;

  drier_start_hour?: number;

  drier_end_hour?: number;

  drying_start_date?: Date;

  drying_end_date?: Date;

  entries: Entry[];
}

export class StoreProcessingActivityDto {
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsNotEmpty()
  admission_id: number;

  @IsNotEmpty()
  admission_entry_id: number;

  @IsNotEmpty()
  gross_quantity: number;

  @IsNotEmpty()
  net_quantity: number;

  @IsNotEmpty()
  firo: number;

  notes: string;

  @IsNotEmpty()
  lot_code: string;

  @IsNotEmpty()
  processing_method_id: number;

  @IsNotEmpty()
  processing_type_id: number;

  @IsNotEmpty()
  processing_unit_id: number;
}
