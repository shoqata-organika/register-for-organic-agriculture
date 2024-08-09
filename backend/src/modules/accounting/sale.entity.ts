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
import { InventoryItem } from '../inventory/inventory-item.entity';
import { MemberResource } from '../members/member-resource.entity';
import { ColumnNumericTransformer } from '../../database/column-numeric-transformer';

export enum SaleType {
  PRODUCT = 'product',
  SERVICE = 'service',
}

export enum ProductType {
  PROCESSED = 'processed',
  NOT_PROCESSED = 'not processed',
}

@Entity({ name: 'sales' })
export class Sale {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'enum', enum: SaleType })
  type: SaleType;

  @Column({ type: 'enum', enum: ProductType, nullable: true })
  product_type: ProductType;

  @ManyToOne(() => InventoryItem)
  @JoinColumn({ name: 'inventory_item_id' })
  inventoryItem: InventoryItem;

  @Column({ nullable: true })
  inventory_item_id: number;

  @JoinColumn({ name: 'customer_id' })
  @ManyToOne(() => MemberResource)
  customer: MemberResource;

  @Column({ type: 'varchar' })
  customer_id: string;

  @Column('decimal', {
    precision: 18,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
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

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
