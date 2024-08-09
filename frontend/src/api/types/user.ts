import { Crop } from './crop';

export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  member: Member;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: number;
  name: string;
  code: string;
}

export type LEGAL_STATUS =
  | 'physical_person'
  | 'individual_business'
  | 'llc'
  | 'agricultural_cooperative';

export enum UserRole {
  MemberAdmin = 'member_admin',
  ReadParcels = 'read_parcels',
  WriteParcels = 'write_parcels',
  ReadFarmActivities = 'read_farm_activities',
  WriteFarmActivities = 'write_farm_activities',
  ReadContractedFarmers = 'read_contracted_farmers',
  WriteContractedFarmers = 'write_contracted_farmers',
  ReadMemberCrops = 'read_member_crops',
  WriteMemberCrops = 'write_member_crops',
  ReadMemberProfile = 'read_member_profile',
  WriteMemberProfile = 'write_member_profile',
  ReadHarvestingAdmissions = 'read_harvesting_admissions',
  WriteHarvestingAdmissions = 'write_harvesting_admissions',
  ReadZones = 'read_zones',
  WriteZones = 'write_zones',
  ReadHarvesters = 'read_harvesters',
  WriteHarvesters = 'write_harvesters',
  ReadCollectionAdmissions = 'read_collection_admissions',
  WriteCollectionAdmissions = 'write_collection_admissions',
  ReadProcessingUnits = 'read_processing_units',
  WriteProcessingUnits = 'write_processing_units',
  ReadDrying = 'read_drying',
  WriteDrying = 'write_drying',
  ReadProcessing = 'read_processing',
  WriteProcessing = 'write_processing',
  ReadCleaningActivities = 'read_cleaning_activities',
  WriteCleaningActivities = 'write_cleaning_activities',
  ReadInventoryLocations = 'read_inventory_locations',
  WriteInventoryLocations = 'write_inventory_locations',
  ReadInventoryItems = 'read_inventory_items',
  ReadSales = 'read_sales',
  WriteSales = 'write_sales',
  ReadExpenses = 'read_expenses',
  WriteExpenses = 'write_expenses',
  ReadUsers = 'read_users',
  WriteUsers = 'write_users',
}

export interface Member {
  id?: number | null;
  code?: string | null;
  username?: string;
  business_name?: string | null;
  business_no?: string | null;
  website_url?: string | null;
  owner_first_name?: string | null;
  owner_last_name?: string | null;
  email?: string | null;
  farmer_no?: string | null;
  applied_standards?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  legal_status?: LEGAL_STATUS | null;
  activities?: string[] | null;
}

export interface MemberCrop {
  id?: number;
  crop_id: string;
  code: string;
  years: Array<number>;
}

export interface MemberCropView {
  id: number;
  crop_id?: number;
  code: string;
  crop: Crop;
  member: Member;
  years: Array<number>;
}

export enum ResourceType {
  PRODUCER = 'producer',
  SUPPLIER = 'supplier',
  CUSTOMER = 'customer',
  PLOUGHING_MACHINE = 'ploughing_machine',
  FERTILIZATION_MACHINE = 'fertilization_machine',
  SEED_PLANTING_MACHINE = 'seed_planting_machine',
  GRAZING_MACHINE = 'grazing_machine',
  STORAGE_UNIT = 'storage_unit',
  FERTILIZATION_PRODUCT = 'fertilization_product',
  CROP_PROTECTION_PRODUCT = 'crop_protection_product',
  HARVESTING_MACHINE = 'harvesting_machine',
  PERSON = 'person',
}

export type MemberResourceType =
  (typeof ResourceType)[keyof typeof ResourceType];

export interface MemberResource {
  id: string;
  name: string;
  resource_type?: MemberResourceType;
}

export enum APPROVAL_STATUS {
  APPROVED = 'approved',
  DECLINED = 'declined',
  PENDING = 'pending',
}

export interface MemberView {
  id: number;
  code: string;
  business_name: string | null;
  business_no: string | null;
  website_url: string | null;
  approval_status: APPROVAL_STATUS | null;
  approved_at: Date | null;
  owner: string;
  email: string | null;
  applied_standards: string | null;
  farmer_no: string | null;
  latitude: number | null;
  longitude: number | null;
  legal_status: LEGAL_STATUS;
  activities: string[] | null;
}
