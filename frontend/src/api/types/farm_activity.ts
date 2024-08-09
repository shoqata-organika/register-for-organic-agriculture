import { LandParcelView } from './land_parcel';
import { Code } from './code_category';

export enum FarmActivityType {
  SOIL_ANALYSIS = 'soil_analysis', // Reflects broader analysis activities, not just land
  LAND_PLOUGHING = 'land_ploughing', // Specifies the activity relates to land
  MILLING = 'milling', // Specifies the activity relates to milling
  BED_PREPARATION = 'bed_preparation', // Specifies the activity relates to bed preparation
  FERTILIZATION = 'fertilization', // Broad term covering all types of soil enrichment, including manuring
  SEED_PLANTING = 'seed_planting', // Clarifies the action of sowing or planting seeds
  CROP_PROTECTION = 'crop_protection', // Broad term for protecting plants from pests, diseases, and weeds
  GRAZING_MANAGEMENT = 'grazing_management', // More specific to managing grazing, not just pastures
  IRRIGATION = 'irrigation', // Emphasizes managing water resources, not just the act of irrigation
  HARVESTING = 'harvesting', // Specifies that it's the harvesting of crops
}

export interface FarmActivity {
  id?: number | null;
  date: Date;
  land_parcel_id: number;
  crop_id?: number;
  part_of_crop_id?: number;
  time_spent?: number;
  comments?: string;
  quantity?: number;
  _tempId?: number;
  details?: any;
  activity_type: string;
  cost?: number;
  file?: string | File | null;
}

export interface FarmActivityView {
  id: number;
  date: Date;
  landParcel: LandParcelView;
  crop: Code;
  partOfCrop: Code;
  time_spent?: number;
  quantity: number;
  comments?: string;
  _tempId?: number;
  details?: any;
  activity_type: string;
  cost?: number;
  file: string | null;
}
