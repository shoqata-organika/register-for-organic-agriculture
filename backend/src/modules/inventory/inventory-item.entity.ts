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
import { Member } from '../members/member.entity';
import { InventoryLocation } from './inventory-location.entity';
import { MemberResource } from '../members/member-resource.entity';
import { Code } from '../code-categories/code.entity';
import { ProcessingActivity } from '../activities/processing-activity.entity';
import { AdmissionEntry } from '../admissions/admission-entry.entity';
import { InventoryOperation } from './inventory-operation.entity';

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

@Entity({ name: 'inventory_items' })
export class InventoryItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'date', name: 'purchase_date', nullable: true })
  purchaseDate: string;

  @Column({ type: 'date', name: 'expiry_date', nullable: true })
  expiryDate: string;

  @ManyToOne(() => Member)
  @JoinColumn({ name: 'member_id' })
  member: Member;

  @Column()
  member_id: number;

  @ManyToOne(() => Code)
  @JoinColumn({ name: 'crop_id' })
  crop: Code;

  @Column({ nullable: true })
  crop_id: number;

  @ManyToOne(() => Code)
  @JoinColumn({ name: 'part_of_crop_id' })
  partOfCrop: Code;

  @Column({ nullable: true })
  part_of_crop_id: number;

  @ManyToOne(() => InventoryLocation)
  @JoinColumn({ name: 'inventory_location_id' })
  inventoryLocation: InventoryLocation;

  @Column({ nullable: true })
  inventory_location_id: number;

  @Column({
    name: 'type',
    type: 'enum',
    enum: InventoryItemType,
  })
  type: InventoryItemType;

  @Column({
    name: 'package_type',
    type: 'enum',
    enum: PackageType,
    nullable: true,
  })
  packageType: PackageType;

  @Column('decimal', { nullable: true, precision: 18, scale: 2 })
  quantity: number;

  @JoinColumn({ name: 'person_id' })
  @ManyToOne(() => MemberResource)
  person: MemberResource;

  @Column({ type: 'varchar', nullable: true })
  person_id: string;

  @JoinColumn({ name: 'producer_id' })
  @ManyToOne(() => MemberResource)
  producer: MemberResource;

  @Column({ type: 'varchar', nullable: true })
  producer_id: string;

  @JoinColumn({ name: 'supplier_id' })
  @ManyToOne(() => MemberResource)
  supplier: MemberResource;

  @Column({ type: 'varchar', nullable: true })
  supplier_id: string;

  @Column({ nullable: true })
  admission_entry_id: number;

  @JoinColumn({ name: 'admission_entry_id' })
  @ManyToOne(() => AdmissionEntry)
  admissionEntry: AdmissionEntry;

  @Column({ nullable: true })
  processing_activity_id: number;

  @JoinColumn({ name: 'processing_activity_id' })
  @ManyToOne(() => ProcessingActivity)
  processingActivity: ProcessingActivity;

  @OneToMany(() => InventoryOperation, (operation) => operation.inventoryItem, {
    cascade: true,
  })
  operations: InventoryOperation[];

  @Column({ type: 'varchar', nullable: true })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  sku: string;

  @Column({ nullable: true })
  notes: string;

  @Column('decimal', { nullable: true, precision: 18, scale: 2 })
  cost: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
