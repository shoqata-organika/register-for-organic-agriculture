import { Crop } from './crop';

export interface LandParcelCrop {
  id?: number | null;
  crop_id: number;
  area: number;
  crop?: Crop;
  planting_date: Date;
  year: number;
  order: number;
  land_parcel_id?: number | null;
  _delete?: boolean;
  _tempId?: number;
  sub_parcel_id?: string;
}

export type SubParcel = {
  id: string;
  code: string;
  area: number;
  land_parcel_id?: number;
  _delete?: boolean;
};

export interface LandParcel {
  id?: number | null;
  code: string;
  location: string;
  total_area: number;
  utilised_area: number;
  ownership_status: 'owned' | 'rented';
  cadastral_no?: string;
  organic_transition_date?: Date;
  applied_standards?: string;
  buffer_zone?: number;
  contract_start_date?: Date;
  contract_end_date?: Date;
  crops?: Array<LandParcelCrop>;
  subParcels: SubParcel[];
  latitude?: number;
  longitude?: number;
  file?: File | null;
}

export interface LandParcelView {
  id: number;
  code: string;
  location: string;
  total_area: number;
  ownership_status: 'owned' | 'rented';
  utilised_area: number;
  cadastral_no?: string;
  buffer_zone: number | null;
  applied_standards: string | null;
  subParcels: SubParcel[];
  crops: Array<LandParcelCrop>;
  organic_transition_date: Date | null;
  contract_start_date: Date;
  contract_end_date: Date;
  latitude: number;
  longitude: number;
  file: string | null;
}
