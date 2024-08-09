import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  OneToMany,
} from 'typeorm';
import { Harvester } from './harvester.entity';
import { Member } from '../members/member.entity';

@Entity({ name: 'zones' })
@Unique(['code', 'member'])
export class Zone {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  name: string;

  @Column('decimal', { nullable: true })
  total_area: number;

  @ManyToOne(() => Member, (member) => member.landParcels)
  @JoinColumn({ name: 'member_id' })
  member: Member;

  @OneToMany(() => Harvester, (harvester) => harvester.zone)
  harvesters: Array<Harvester>;

  @Column({ nullable: true })
  num_of_harvesters: number;

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

  @Column()
  member_id: number;

  @Column({ type: 'varchar', nullable: true })
  file: string;
}
