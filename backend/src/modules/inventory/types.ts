import { InventoryItemType } from './inventory-item.entity';

export interface Activity {
  id: number;
  crop_id: number;
  part_of_crop_id: number;
  net_quantity: number;
  gross_quantity?: number;
  type: InventoryItemType;
}
