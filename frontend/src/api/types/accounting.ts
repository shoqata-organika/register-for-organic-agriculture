import { InventoryItem } from './inventory';
import { MemberResource } from './user';

export type Expense = {
  id: number;
  date: Date;
  supplier: MemberResource;
  supplier_id: string;
  product: string;
  quantity: number;
  type: ExpenseType;
  price: number;
  notes?: string | null;
};

export enum SaleType {
  PRODUCT = 'product',
  SERVICE = 'service',
}

export enum ExpenseType {
  OTHER = 'other',
  LAND_PLOUGHING = 'land_ploughing', // Specifies the activity relates to land
  MILLING = 'milling', // Specifies the activity relates to milling
  BED_PREPARATION = 'bed_preparation',
}

export type Sale = {
  id: number;
  date: Date;
  customer: MemberResource;
  customer_id: string;
  type: SaleType;
  inventory_item_id?: number;
  inventoryItem?: InventoryItem;
  product_type?: 'processed' | 'not processed';
  description: string | null;
  quantity: number;
  price: number;
  notes?: string | null;
};
