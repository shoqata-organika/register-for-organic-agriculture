import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Member } from '../members/member.entity';
import { FarmActivity } from '../activities/farm-activity.entity';
import { LandParcelCrop } from './land-parcel-crop.entity';
import { SubParcel } from './subparcel.entity';
import { ContractedFarmer } from '../contracted_farmers/contracted-farmer.entity';

enum Ownership {
  OWNED = 'owned',
  RENTED = 'rented',
}

@Entity({ name: 'land_parcels' })
@Unique(['code', 'member', 'contracted_farmer_id'])
export class LandParcel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column({ nullable: true })
  location: string;

  @ManyToOne(() => Member, (member) => member.landParcels)
  @JoinColumn({ name: 'member_id' })
  member: Member;

  @Column()
  member_id: number;

  @Column('decimal', { nullable: true })
  buffer_zone: number;

  @Column({ nullable: true })
  cadastral_no: string;

  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  total_area: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  utilised_area: number;

  @Column({ type: 'date', nullable: true })
  organic_transition_date: Date;

  @Column('text', { nullable: true })
  applied_standards: string;

  @Column({
    type: 'enum',
    enum: Ownership,
    default: Ownership.OWNED,
  })
  ownership_status: string;

  @Column({
    type: 'date',
    nullable: true,
  })
  contract_start_date: Date;

  @Column({
    type: 'date',
    nullable: true,
  })
  contract_end_date: Date;

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

  @ManyToOne(
    () => ContractedFarmer,
    (contractedFarmer) => contractedFarmer.landParcels,
  )
  @JoinColumn({ name: 'contracted_farmer_id' })
  contractedFarmer: ContractedFarmer;

  @Column({ nullable: true })
  contracted_farmer_id: number;

  @Column({ type: 'varchar', nullable: true })
  file: string;

  @OneToMany(() => FarmActivity, (farmActivity) => farmActivity.landParcel)
  farmActivities: FarmActivity[];

  @OneToMany(() => SubParcel, (subparcel) => subparcel.landParcel, {
    cascade: ['remove'],
  })
  subParcels: SubParcel[];

  @OneToMany(
    () => LandParcelCrop,
    (landParcelCrop) => landParcelCrop.landParcel,
    { cascade: true },
  )
  crops: LandParcelCrop[];
}
