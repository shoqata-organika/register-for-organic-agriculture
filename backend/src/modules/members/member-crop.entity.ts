import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Code } from '../code-categories/code.entity';
import { Member } from '../members/member.entity';

@Entity({ name: 'member_crops' })
@Unique(['code', 'member', 'crop_id'])
export class MemberCrop {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'jsonb' })
  years: Array<number>;

  @ManyToOne(() => Code)
  @JoinColumn({ name: 'crop_id' })
  crop: Code;

  @Column()
  crop_id: number;

  @Column()
  code: string;

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
