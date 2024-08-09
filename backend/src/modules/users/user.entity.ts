import { Member } from '../members/member.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

type UserRole =
  | 'admin'
  | 'member_admin'
  | 'read_parcels'
  | 'write_parcels'
  | 'read_farm_activities'
  | 'write_farm_activities'
  | 'read_contracted_farmers'
  | 'write_contracted_farmers'
  | 'read_member_crops'
  | 'write_member_crops'
  | 'read_member_profile'
  | 'write_member_profile'
  | 'read_harvesting_admissions'
  | 'write_harvesting_admissions'
  | 'read_zones'
  | 'write_zones'
  | 'read_harvesters'
  | 'write_harvesters'
  | 'read_collection_admissions'
  | 'write_collection_admissions'
  | 'read_processing_units'
  | 'write_processing_units'
  | 'read_drying'
  | 'write_drying'
  | 'read_processing'
  | 'write_processing'
  | 'read_cleaning_activities'
  | 'write_cleaning_activities'
  | 'read_inventory_locations'
  | 'write_inventory_locations'
  | 'read_inventory_items'
  | 'read_sales'
  | 'write_sales'
  | 'read_expenses'
  | 'write_expenses'
  | 'read_users'
  | 'write_users';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ unique: true })
  username: string;

  @Column({ select: false })
  password: string;

  @Column({ nullable: true })
  email: string;

  @ManyToOne(() => Member, (member) => member.users)
  @JoinColumn({ name: 'member_id' })
  member: Member;

  @Column({ nullable: true })
  member_id: number;

  @BeforeInsert()
  async hashPassword() {
    console.log('hashing password');
    if (this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  @Column({ type: 'jsonb', default: ['member_admin'] })
  roles: UserRole[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
