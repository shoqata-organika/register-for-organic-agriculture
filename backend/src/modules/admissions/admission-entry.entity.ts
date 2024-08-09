import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Code } from '../code-categories/code.entity';
import { CropState, CropStatus } from '../activities/types';
import { Admission } from './admission.entity';

@Entity({ name: 'admission_entries' })
export class AdmissionEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn({ name: 'crop_id' })
  @ManyToOne(() => Code)
  crop: Code;

  @Column()
  crop_id: number;

  @JoinColumn({ name: 'part_of_crop_id' })
  @ManyToOne(() => Code)
  partOfCrop: Code;

  @Column()
  part_of_crop_id: number;

  @Column({
    type: 'enum',
    enum: CropState,
    default: CropState.DRY,
    name: 'crop_state',
  })
  cropState: CropState;

  @Column({
    type: 'enum',
    enum: CropStatus,
    default: CropStatus.ORGANIC,
    name: 'crop_status',
  })
  cropStatus: CropStatus;

  @Column('decimal', {
    nullable: true,
    precision: 18,
    scale: 2,
    name: 'gross_quantity',
  })
  gross_quantity: number;

  @Column('decimal', {
    nullable: true,
    precision: 18,
    scale: 2,
    name: 'net_quantity',
  })
  net_quantity: number;

  @JoinColumn({ name: 'admission_id' })
  @ManyToOne(() => Admission, { nullable: false })
  admission: Admission;

  @Column({ name: 'admission_id' })
  admission_id: number;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
