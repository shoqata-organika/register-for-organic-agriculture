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
import { Harvester } from '../members/harvester.entity';
import { Zone } from '../members/zone.entity';
import { Member } from '../members/member.entity';
import { ContractedFarmer } from '../contracted_farmers/contracted-farmer.entity';
import { LandParcel } from '../land-parcels/land-parcel.entity';
import { AdmissionEntry } from './admission-entry.entity';

export enum AdmissionType {
  HARVESTING = 'harvesting',
  COLLECTION = 'collection',
  PURCHASE = 'purchase',
}
@Entity({ name: 'admissions' })
export class Admission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  admission_no: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ nullable: true })
  notes: string;

  @Column({
    name: 'type',
    type: 'enum',
    default: AdmissionType.COLLECTION,
    enum: AdmissionType,
  })
  type: AdmissionType;

  @JoinColumn({ name: 'harvester_id' })
  @ManyToOne(() => Harvester)
  harvester: Harvester;

  @Column({ nullable: true })
  harvester_id: number;

  @JoinColumn({ name: 'contracted_farmer_id' })
  @ManyToOne(() => ContractedFarmer)
  contractedFarmer: ContractedFarmer;

  @Column({ nullable: true })
  contracted_farmer_id: number;

  @JoinColumn({ name: 'zone_id' })
  @ManyToOne(() => Zone)
  zone: Zone;

  @Column({ nullable: true })
  zone_id: number;

  @JoinColumn({ name: 'land_parcel_id' })
  @ManyToOne(() => LandParcel)
  landParcel: LandParcel;

  @Column({ nullable: true })
  land_parcel_id: number;

  @OneToMany(() => AdmissionEntry, (entry) => entry.admission, {
    cascade: true,
  })
  entries: AdmissionEntry[];

  @ManyToOne(() => Member)
  @JoinColumn({ name: 'member_id' })
  member: Member;

  @Column()
  member_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
