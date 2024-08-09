import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LandParcel } from './land-parcel.entity';
import { Code } from '../code-categories/code.entity';
import { SubParcel } from './subparcel.entity';

@Entity({ name: 'land_parcel_crops' })
export class LandParcelCrop {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn({ name: 'land_parcel_id' })
  @ManyToOne(() => LandParcel, (landParcel) => landParcel.crops)
  landParcel: LandParcel;

  @Column()
  land_parcel_id: number;

  @JoinColumn({ name: 'sub_parcel_id' })
  @ManyToOne(() => SubParcel)
  subParcel: SubParcel;

  @Column({ nullable: true })
  sub_parcel_id: string;

  @JoinColumn({ name: 'crop_id' })
  @ManyToOne(() => Code)
  crop: Code;

  @Column()
  crop_id: number;

  @Column({
    type: 'date',
    nullable: true,
  })
  planting_date: string;

  @Column({
    type: 'int',
    default: new Date().getFullYear(),
  })
  year: number;

  @Column({
    type: 'int',
    default: 1,
    unsigned: false,
  })
  order: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
