export enum CropType {
  CROPS = 'CROPS',
  BMA_CROPS = 'BMA_CROPS',
}

export interface Crop {
  created_at: string;
  id: number;
  code: string;
  name: string;
  name_sq: string;
  name_sr: string;
  updated_at: string;
}
