import { CropState, CropStatus } from './common';
import { ContractedFarmer, ContractedFarmerView } from './contracted_farmers';
import { Crop } from './crop';
import { Harvester } from './harvester';
import { LandParcel } from './land_parcel';
import { Zone } from './zone';

export enum AdmissionType {
  HARVESTING = 'harvesting',
  COLLECTION = 'collection',
  PURCHASE = 'purchase',
}
export interface Admission {
  id: number;
  date: Date;
  zone_id?: number;
  admission_no?: string;
  harvester_id?: number;
  harvester?: Harvester;
  contracted_farmer_id?: number;
  contractedFarmer?: ContractedFarmer;
  type: AdmissionType;
  entries?: AdmissionEntry[];
  zone?: Zone;
  landParcel?: LandParcel;
}

export interface AdmissionEntry {
  id?: number;
  crop_id: number;
  part_of_crop_id: number;
  net_quantity: number;
  gross_quantity: number;
  cropState: CropState;
  cropStatus: CropStatus;
  _tempId?: number;
  notes?: string | null;
  admission_id?: number;
  admission?: Admission;
}

export interface AdmissionEntryView extends AdmissionEntry {
  id: number;
  crop: Crop;
  partOfCrop: Crop;
  date: Date;
  contractedFarmer: ContractedFarmerView;
  admission_no: string;
  zone?: Zone;
  landParcel?: LandParcel;
  harvester?: Harvester;
}
