import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Code } from '../code-categories/code.entity';
import { ProcessingActivity } from './processing-activity.entity';
import { CropState, CropStatus } from './types';
import { InventoryItem } from '../inventory/inventory-item.entity';

@Entity({ name: 'processing_activity_entries' })
export class ProcessingActivityEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  inventory_item_id: number;

  @JoinColumn({ name: 'inventory_item_id' })
  @ManyToOne(() => InventoryItem)
  inventoryItem: InventoryItem;

  @Column({ nullable: false })
  processing_activity_id: number;

  @JoinColumn({ name: 'processing_activity_id' })
  @ManyToOne(() => ProcessingActivity)
  processingActivity: ProcessingActivity;

  @JoinColumn({ name: 'crop_id' })
  @ManyToOne(() => Code)
  crop: Code;

  @Column()
  crop_id: number;

  @JoinColumn({ name: 'part_of_crop_id' })
  @ManyToOne(() => Code)
  partOfCrop: Code;

  @Column()
  part_of_crop_id: number;

  @Column({
    type: 'enum',
    enum: CropState,
    default: CropState.DRY,
    name: 'crop_state',
  })
  cropState: CropState;

  @Column({
    type: 'enum',
    enum: CropStatus,
    default: CropStatus.ORGANIC,
    name: 'crop_status',
  })
  cropStatus: CropStatus;

  @Column('decimal', {
    nullable: true,
    precision: 18,
    scale: 2,
    name: 'gross_quantity',
  })
  grossQuantity: number;

  @Column('decimal', {
    nullable: true,
    precision: 18,
    scale: 2,
    name: 'net_quantity',
  })
  netQuantity: number;

  @Column('decimal', {
    nullable: true,
    precision: 18,
    scale: 2,
    name: 'firo',
  })
  firo: number;

  @Column({ nullable: true })
  fraction: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
