import {
  Entity,
  Column,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  OneToMany,
} from 'typeorm';
import { Member } from '../members/member.entity';
import { LandParcel } from '../land-parcels/land-parcel.entity';

@Entity('contracted_farmers')
@Unique(['code', 'member'])
export class ContractedFarmer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ nullable: true, type: 'bigint' })
  personal_num: number;

  @Column({ type: 'varchar', nullable: true })
  address: string;

  @Column({ nullable: true })
  external_id: string;

  @ManyToOne(() => Member, (member) => member.contractedFarmers)
  @JoinColumn({ name: 'member_id' })
  member: Member;

  @Column()
  member_id: number;

  @OneToMany(() => LandParcel, (landParcel) => landParcel.contractedFarmer, {
    cascade: true,
  })
  landParcels: LandParcel[];

  @Column({ type: 'text' })
  code: string;

  @Column({ type: 'varchar', nullable: true })
  image: string;

  @DeleteDateColumn()
  deletedAt: Date;
}
