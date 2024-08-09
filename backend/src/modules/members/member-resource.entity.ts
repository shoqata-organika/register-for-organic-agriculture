import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Member } from './member.entity';

export enum ResourceType {
  PRODUCER = 'producer',
  SUPPLIER = 'supplier',
  CUSTOMER = 'customer',
  PLOUGHING_MACHINE = 'ploughing_machine',
  FERTILIZATION_MACHINE = 'fertilization_machine',
  SEED_PLANTING_MACHINE = 'seed_planting_machine',
  GRAZING_MACHINE = 'grazing_machine',
  STORAGE_UNIT = 'storage_unit',
  FERTILIZATION_PRODUCT = 'fertilization_product',
  CROP_PROTECTION_PRODUCT = 'crop_protection_product',
  HARVESTING_MACHINE = 'harvesting_machine',
  PERSON = 'person',
}

export interface BasicMemberResource {
  id: string;
  name: string;
}

@Entity({ name: 'member_resources' })
export class MemberResource {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @ManyToOne(() => Member)
  @JoinColumn({ name: 'member_id' })
  member: Member;

  @Column({ name: 'member_id' })
  member_id: number;

  @Column({
    name: 'resource_type',
    type: 'enum',
    enum: ResourceType,
  })
  resource_type: ResourceType;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
