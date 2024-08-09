import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Code } from '../code-categories/code.entity';
import { LandParcel } from '../land-parcels/land-parcel.entity';
import { Admission } from '../admissions/admission.entity';
import { Member } from '../members/member.entity';
import { InventoryOperation } from '../inventory/inventory-operation.entity';

export enum ActivityType {
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

export enum Unit {
  KG = 'kg',
  TONNE = 'tonne',
  LITRE = 'litre',
  ACRE = 'acre',
}

export interface SoilAnalysisDetails {
  ph_level: number;
  n_level: number;
  p_level: number;
  k_level: number;
  file?: any;
}

export interface PloughingDetails {
  depth: number;
  devices: { id: string; name: string }[];
}

export interface FertilizationDetails {
  product: { id: string; name: string };
  type: 'organic' | 'inorganic';
  origin:
    | 'plant_origin'
    | 'animal_origin'
    | 'compost'
    | 'nitrogen_based'
    | 'phosphoric'
    | 'potassic'
    | 'micronutrients';
  subtype:
    | 'superphosphate'
    | 'ammonium_nitrate'
    | 'potassium_sulphate'
    | 'not_applicable';
  producer: { id: string; name: string };
  supplier: { id: string; name: string };
  remaining_quantity: number;
  n_quantity: number;
  devices: { id: string; name: string }[];
  fuel_used: number;
}

export interface CropProtectionDetails {
  product: { id: string; name: string };
  disease_id: number;
  active_ingredient: string;
  cu_quantity: number;
  remaining_quantity: number;
  supplier: { id: string; name: string };
}

export interface SeedPlantingDetails {
  material_type: 'seed' | 'seedling' | 'cutting' | 'root';
  material_origin: 'own' | 'purchased';
  status: 'organic' | 'conventional' | 'untreated_conventional';
  distance: string;
  type: 'manual' | 'mechanical';
  devices: { id: string; name: string }[];
  fuel_used: number;
  remaining_quantity: number;
  persons: number;
}

export interface IrrigationDetails {
  method: 'drip' | 'sprinkler';
  frequency: number;
  source: 'well' | 'river' | 'public_systems';
  frequency_unit: 'day' | 'week' | 'month';
}

export interface GrazingManagementDetails {
  type: 'manual' | 'mechanical';
  devices: { id: string; name: string }[];
}
export interface HarvestingDetails {
  type: 'manual' | 'mechanical';
  packaging_type: string;
  storage_unit: { id: string; name: string };
  devices: { id: string; name: string }[];
  persons: number;
  fuel_used: number;
}

export type ActivityDetails =
  | SoilAnalysisDetails
  | PloughingDetails
  | FertilizationDetails
  | SeedPlantingDetails
  | IrrigationDetails
  | GrazingManagementDetails
  | HarvestingDetails
  | CropProtectionDetails;

@Entity({ name: 'farm_activities' })
export class FarmActivity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', nullable: true })
  date: string;

  @JoinColumn({ name: 'land_parcel_id' })
  @ManyToOne(() => LandParcel)
  landParcel: LandParcel;

  @Column()
  land_parcel_id: number;

  @JoinColumn({ name: 'crop_id' })
  @ManyToOne(() => Code)
  crop: Code;

  @Column({ nullable: true })
  crop_id: number;

  @JoinColumn({ name: 'part_of_crop_id' })
  @ManyToOne(() => Code)
  partOfCrop: Code;

  @Column({ nullable: true })
  part_of_crop_id: number;

  @Column({
    name: 'activity_type',
    type: 'enum',
    enum: ActivityType,
  })
  activity_type: ActivityType;

  @Column('decimal', { nullable: true, precision: 18, scale: 2 })
  quantity: number;

  @Column({
    type: 'enum',
    enum: Unit,
    nullable: true,
  })
  unit: Unit;

  @Column('decimal', { nullable: true, precision: 18, scale: 2 })
  cost: number;

  @Column('decimal', { nullable: true, precision: 18, scale: 2 })
  time_spent: number;

  @Column('varchar', { nullable: true })
  file: string;

  @Column({ nullable: true, type: 'jsonb' })
  details: ActivityDetails;

  @Column({ nullable: true })
  comments: string;

  @ManyToOne(() => Member)
  @JoinColumn({ name: 'member_id' })
  member: Member;

  @Column()
  member_id: number;

  @OneToMany(() => InventoryOperation, (entry) => entry.farmActivity, {
    cascade: true,
  })
  inventoryOperations: InventoryOperation[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @JoinColumn({ name: 'admission_id' })
  @ManyToOne(() => Admission, { nullable: true })
  admission: Admission;
}
