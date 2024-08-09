import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Member } from './member.entity';
import { Zone } from './zone.entity';

enum LegalStatus {
  PHYSICAL = 'physical',
  LEGAL = 'legal',
}

@Entity({ name: 'harvesters' })
@Unique(['code', 'member'])
export class Harvester {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  external_id: string;

  @Column()
  code: string;

  @Column({ nullable: true })
  family_members: number;

  @Column({
    type: 'enum',
    enum: LegalStatus,
    default: LegalStatus.LEGAL,
  })
  legal_status: LegalStatus;

  @ManyToOne(() => Zone, (zone) => zone.harvesters, { nullable: true })
  @JoinColumn({ name: 'zone_id' })
  zone: Zone;

  @Column({ nullable: true })
  zone_id: number;

  @JoinColumn({ name: 'member_id' })
  @ManyToOne(() => Member, (member) => member.harvesters)
  member: Member;

  @Column({ type: 'varchar', nullable: true })
  image: string;

  @Column({ type: 'varchar', nullable: true })
  contract_file: string;

  @Column()
  member_id: number;

  @DeleteDateColumn()
  deletedAt: Date;
}
