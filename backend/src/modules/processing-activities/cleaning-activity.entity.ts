import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MemberResource } from '../members/member-resource.entity';
import { ProcessingUnit } from '../processing-units/processing-unit.entity';
import { Member } from '../members/member.entity';

@Entity({ name: 'cleaning_activities' })
export class CleaningActivity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' }) // Recommended
  date: string;

  @JoinColumn({ name: 'processing_unit_id' })
  @ManyToOne(() => ProcessingUnit)
  processingUnit: ProcessingUnit;

  @Column({ nullable: true })
  processing_unit_id: number;

  @Column({ nullable: true })
  cleaned_device: string;

  @Column({ nullable: true })
  reason_of_cleaning: string;

  @Column({ type: 'varchar', nullable: true })
  area: string;

  @Column({ type: 'varchar', nullable: true })
  cleaning_tool: string;

  @JoinColumn({ name: 'person_id' })
  @ManyToOne(() => MemberResource)
  person: MemberResource;

  @Column({ type: 'varchar', nullable: true })
  person_id: string;

  @ManyToOne(() => Member)
  @JoinColumn({ name: 'member_id' })
  member: Member;

  @Column()
  member_id: number;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
