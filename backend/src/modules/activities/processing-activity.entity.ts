import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Code } from '../code-categories/code.entity';
import { Member } from '../members/member.entity';
import { ProcessingUnit } from '../processing-units/processing-unit.entity';
import { ProcessingActivityEntry } from './processing-activity-entry.entity';

export enum ProcessingType {
  DIVISION = 'division', // cleaning incluaded
  DRYING = 'drying',
  FREEZING = 'freezing',
  PRESSING = 'pressing',
  GRINDING = 'grinding',
  EXTRACTION = 'extraction',
  INCISION = 'incision',
  BLENDING = 'blending',
  FERMENTATION = 'fermentation',
  FILTERING = 'filtering',
}

@Entity({ name: 'processing_activities' })
export class ProcessingActivity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' }) // Recommended
  date: string;

  @JoinColumn({ name: 'parent_activity_id' })
  @OneToOne(() => ProcessingActivity, { nullable: true })
  parentActivity: ProcessingActivity;

  @Column({ nullable: true })
  parent_activity_id: number;

  @JoinColumn({ name: 'processing_method_id' })
  @ManyToOne(() => Code, { nullable: true })
  processingMethod: Code;

  @Column({ nullable: true })
  processing_method_id: number;

  @Column({
    type: 'enum',
    enum: ProcessingType,
    default: ProcessingType.EXTRACTION,
    name: 'processing_type',
  })
  processingType: ProcessingType;

  @JoinColumn({ name: 'processing_unit_id' })
  @ManyToOne(() => ProcessingUnit)
  processingUnit: Code;

  @Column()
  processing_unit_id: number;

  @Column({ nullable: true })
  notes: string;

  @Column({ name: 'lot_code' })
  lotCode: string;

  @Column({ nullable: true })
  drier_number: string;

  @Column({ nullable: true })
  drier_temp: number;

  @Column('decimal', { nullable: true })
  drier_start_hour: number;

  @Column('decimal', { nullable: true })
  drier_end_hour: number;

  @Column({
    type: 'date',
    nullable: true,
  })
  drying_start_date: Date;

  @Column({
    type: 'date',
    nullable: true,
  })
  drying_end_date: Date;

  @OneToMany(
    () => ProcessingActivityEntry,
    (entry) => entry.processingActivity,
    {
      cascade: true,
    },
  )
  entries: ProcessingActivityEntry[];

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
