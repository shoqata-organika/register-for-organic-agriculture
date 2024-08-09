import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { InventoryItem } from './inventory-item.entity';
import { ColumnNumericTransformer } from '../../database/column-numeric-transformer';
import { FarmActivity } from '../activities/farm-activity.entity';

@Entity({ name: 'inventory_operations' })
export class InventoryOperation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', nullable: true })
  date: string;

  @ManyToOne(() => InventoryItem)
  @JoinColumn({ name: 'inventory_item_id' })
  inventoryItem: InventoryItem;

  @Column()
  inventory_item_id: number;

  @Column({ nullable: true })
  farm_activity_id: number;

  @JoinColumn({ name: 'farm_activity_id' })
  @ManyToOne(() => FarmActivity)
  farmActivity: FarmActivity;

  @Column('decimal', {
    nullable: true,
    precision: 18,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  quantity: number;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
