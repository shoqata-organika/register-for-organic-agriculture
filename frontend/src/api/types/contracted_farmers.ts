export interface ContractedFarmer {
  id?: number | null;
  personal_num?: number;
  code: string;
  name: string;
  address?: string;
  external_id?: string;
  image?: File | string;
  landParcels: { id: number; code: string }[];
}

export interface ContractedFarmerView {
  id: number;
  code: string;
  name: string;
  personal_num?: number | null;
  address?: string;
  external_id?: string;
  image?: string | null;
  landParcels?: { id: number; code: string }[];
}
