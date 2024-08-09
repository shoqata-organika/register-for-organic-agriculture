import { Admission, AdmissionEntry } from './admission';
import { Code } from './code_category';
import { LandParcel } from './land_parcel';
import { Zone } from './zone';

export enum ProcessingType {
  DIVISION = 'division',
  DRYING = 'drying',
  FREEZING = 'freezing',
  PRESSING = 'pressing',
  GRINDING = 'grinding',
  EXTRACTION = 'extraction',
}

export interface ProcessingActivityEntry {
  id?: number;
  admission_entry_id: string;
  gross_quantity: number;
  net_quantity: number;
  inventory_item_id: number;
  firo: number;
  cropState: string;
  cropStatus: string;
  crop_id: string;
  part_of_crop_id: string;
  fraction: string;
  _tempId?: number;
}

export interface ProcessingActivity {
  id?: number | null;
  date: Date | string;
  admission_id: number;
  admission_entry_id: string;
  lot_code: string;
  processing_method_id?: string;
  processing_type: string;
  processing_unit_id: string;
  drier_temp?: number | null;
  drier_start_hour?: number | null;
  drier_end_hour?: number | null;
  drying_start_date?: Date | null;
  drying_end_date?: Date | null;
  drier_number?: string;
  notes?: string;
  entries: ProcessingActivityEntry[];
}

export interface StoreProcessingActivity {
  id?: number;
  date: Date | string;
  admission_id: number;
  admission_entry_id: number;
  gross_quantity: number;
  net_quantity: number;
  processing_method_id?: number;
  firo: number;
  notes?: string;
  lot_code: string;
}

export interface DetailedProcessingActivity {
  id: number;
  date: string;
  admission: Admission;
  admission_id: number;
  admission_entry_id: number;
  crop: Code;
  partOfCrop: Code;
  processing_method: Code;
  processing_type: Code;
  processing_unit: Code;
  admissionEntry?: AdmissionEntry | null;
  crop_state: 'dry' | 'fresh';
  crop_status: 'organic' | 'conventional';
  gross_quantity: number;
  net_quantity: number;
  firo: number;
  notes: string;
  lot_code: string;
  zone?: Zone;
  land_parcel: LandParcel;
}

export interface ProcessingActivityView extends DetailedProcessingActivity {
  zone_land_parcel: string;
  processing_method_name: string;
  part_of_crop_name: string;
  crop_name: string;
}
