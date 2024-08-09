import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { LandParcel } from '../land-parcels/land-parcel.entity';
import { Harvester } from './harvester.entity';
import { User } from '../users/user.entity';
import { Zone } from './zone.entity';
import { ContractedFarmer } from '../contracted_farmers/contracted-farmer.entity';
import { ProcessingUnit } from '../processing-units/processing-unit.entity';
import { MemberResource } from './member-resource.entity';
import { InventoryItem } from '../inventory/inventory-item.entity';

enum LegalStatus {
  PHYSICAL_PERSON = 'physical_person',
  LLC = 'llc',
  INDIVIDUAL_BUSINESS = 'individual_business',
  AGRICULTURAL_COOPERATIVE = 'agricultural_cooperative',
}

export enum APPROVAL_STATUS {
  APPROVED = 'approved',
  DECLINED = 'declined',
  PENDING = 'pending',
}

@Entity({ name: 'members' })
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => LandParcel, (landParcel) => landParcel.member)
  landParcels: LandParcel[];

  @Column({ nullable: true })
  business_name: string;

  @Column({ nullable: true })
  applied_standards: string;

  @OneToMany(() => User, (user) => user.member)
  users: User[];

  @Column({ type: 'varchar', nullable: true })
  website_url: string;

  @Column({ type: 'jsonb', nullable: true })
  owner: string; // TODO: { first_name?: string; last_name?: string }

  @Column({ nullable: true })
  approved_at: Date;

  @Column({
    type: 'enum',
    enum: APPROVAL_STATUS,
    default: APPROVAL_STATUS.PENDING,
    nullable: true,
  })
  approval_status: APPROVAL_STATUS;

  @Column({
    type: 'decimal',
    nullable: true,
    scale: 5,
    precision: 7,
  })
  latitude: number;

  @Column({
    type: 'decimal',
    nullable: true,
    scale: 5,
    precision: 7,
  })
  longitude: number;

  @Column({ nullable: true })
  business_no: string;

  @Column({ nullable: true })
  farmer_no: string;

  @Column({
    type: 'enum',
    enum: LegalStatus,
    nullable: true,
  })
  legal_status: LegalStatus;

  @OneToMany(
    () => ContractedFarmer,
    (contractedFarmer) => contractedFarmer.member,
  )
  contractedFarmers: ContractedFarmer[];

  @OneToMany(() => InventoryItem, (inventoryItem) => inventoryItem.member)
  inventoryItems: InventoryItem[];

  @Column({ type: 'varchar', nullable: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  phone_number: string;

  @OneToMany(() => Harvester, (harvester) => harvester.member)
  harvesters: Harvester[];

  @OneToMany(() => MemberResource, (resource) => resource.member)
  resources: MemberResource[];

  @OneToMany(() => ProcessingUnit, (processingUnit) => processingUnit.member)
  processingUnits: ProcessingUnit[];

  @OneToMany(() => Zone, (zone) => zone.member)
  zones: Zone[];

  @Column({ type: 'jsonb', nullable: true })
  activities: string; // TODO: Array<string>

  @Column({ nullable: true })
  code: string;
}
