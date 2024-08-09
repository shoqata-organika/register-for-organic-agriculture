import { AdmissionEntry } from './admission';
import { Code } from './code_category';
import { Member, MemberResource } from './user';

export type InventoryLocation = {
  id: number;
  name: string;
  area?: number | null;
};

export enum InventoryItemType {
  HARVESTED_PRODUCT = 'harvested_product',
  DRIED_PRODUCT = 'dried_product',
  COLLECTED_PRODUCT = 'collected_product',
  PURCHASED_PRODUCT = 'purchased_product',
  PROCESSED_PRODUCT = 'processed_product',
  INPUT = 'input',
  PLANTING_MATERIAL = 'planting_material',
}

export enum PackageType {
  BAG = 'bag',
  BOTTLE = 'bottle',
  BOX = 'box',
  CAN = 'can',
  CARTON = 'carton',
  CRATE = 'crate',
  DRUM = 'drum',
  JAR = 'jar',
  JUG = 'jug',
  PAIL = 'pail',
  SACK = 'sack',
  TANK = 'tank',
  TOTE = 'tote',
  TUBE = 'tube',
  OTHER = 'other',
}
export type InventoryItem = {
  id: number;
  date: Date;
  purchaseDate: Date;
  expiryDate: Date;
  member?: Member;
  member_id: number;
  inventoryLocation?: InventoryLocation;
  inventory_location_id: number;
  type: InventoryItemType;
  packageType: PackageType;
  quantity: number;
  admission_entry_id?: number;
  admissionEntry: AdmissionEntry;
  person?: MemberResource | null;
  producer_id: number;
  producer?: MemberResource;
  crop?: Code;
  cost?: number;
  partOfCrop?: Code;
  name?: string;
  description?: string;
};

export interface StoreInventoryItemDto {
  date: Date;
  quantity: number;
  notes?: string | null;
  package_type: PackageType;
  type: InventoryItemType;
  inventory_location_id: number;
  admission_entry_id?: number;
  person: MemberResource;
}

export interface StoreAdmissionInventoryItemDto extends StoreInventoryItemDto {
  crop_id: number;
  part_of_crop_id: number;
}
