import {
  Entity,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';
import { LandParcel } from './land-parcel.entity';

@Entity({ name: 'subparcels' })
export class SubParcel {
  @PrimaryColumn()
  id: string;

  @Column()
  code: string;

  @JoinColumn({ name: 'land_parcel_id' })
  @ManyToOne(() => LandParcel, (landParcel) => landParcel.crops)
  landParcel: LandParcel;

  @Column()
  land_parcel_id: number;

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 4,
  })
  area: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
