import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Member } from '../members/member.entity';

enum Ownership {
  OWNED = 'owned',
  RENTED = 'rented',
}

@Entity('processing_units')
export class ProcessingUnit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Member, (member) => member.landParcels)
  @JoinColumn({ name: 'member_id' })
  member: Member;

  @Column()
  member_id: number;

  @Column({ nullable: true })
  address: string;

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

  @Column({ nullable: true })
  type_of_processing: string;

  @Column('decimal')
  total_area: number;

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

  @Column({ type: 'varchar', nullable: true })
  file: string;
}
