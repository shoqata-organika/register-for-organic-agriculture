import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Member } from '../members/member.entity';
import { MemberResource } from '../members/member-resource.entity';
import { FarmActivity } from '../activities/farm-activity.entity';

export enum ExpenseType {
  OTHER = 'other',
  LAND_PLOUGHING = 'land_ploughing', // Specifies the activity relates to land
  MILLING = 'milling', // Specifies the activity relates to milling
  BED_PREPARATION = 'bed_preparation',
}
@Entity({ name: 'expenses' })
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ExpenseType,
    default: ExpenseType.OTHER,
  })
  type: ExpenseType;

  @JoinColumn({ name: 'supplier_id' })
  @ManyToOne(() => MemberResource)
  supplier: MemberResource;

  @Column({ type: 'varchar', nullable: true })
  supplier_id: string;

  @Column({ nullable: true })
  product: string;

  @Column('decimal', {
    precision: 18,
    scale: 2,
  })
  quantity: number;

  @Column('decimal', {
    precision: 18,
    scale: 2,
    name: 'price_per_unit',
  })
  price: number;

  @Column({ type: 'date' }) // Recommended
  date: string;

  @Column({ nullable: true })
  notes: string;

  @ManyToOne(() => Member)
  @JoinColumn({ name: 'member_id' })
  member: Member;

  @Column()
  member_id: number;

  @Column({ nullable: true })
  farm_activity_id: number;

  @JoinColumn({ name: 'farm_activity_id' })
  @ManyToOne(() => FarmActivity)
  farmActivity: FarmActivity;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
