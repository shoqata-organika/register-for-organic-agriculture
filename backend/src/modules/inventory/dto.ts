import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { BasicMemberResource } from '../members/member-resource.entity';
import { InventoryItemType, PackageType } from './inventory-item.entity';

export class StoreInventoryItemDto {
  id?: number | null;

  @Type(() => Date)
  date: Date;

  @Type(() => Date)
  purchaseDate?: Date;

  @Type(() => Date)
  expiryDate?: Date;

  name: string;
  description: string;

  @IsNotEmpty()
  inventory_location_id?: number;

  quantity: number;
  cost?: number;

  notes?: string;

  package_type?: PackageType;

  type: InventoryItemType;

  person?: BasicMemberResource;
  producer?: BasicMemberResource;
  supplier?: BasicMemberResource;

  sku?: string;
}
export class StoreAdmissionInventoryItemDto extends StoreInventoryItemDto {
  admission_entry_id: number;

  crop_id: number;

  part_of_crop_id: number;
}
