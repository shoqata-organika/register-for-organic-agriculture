export interface CodeCategory {
  id: number;
  name: string;
  name_sq: string;
  name_sr: string;
  api_name: string;
  codes: Code[];
}

export enum API_NAMES {
  CROPS = 'CROPS',
  CROP_PARTS = 'CROP_PARTS',
  BMA_CROPS = 'BMA_CROPS',
  BMA_CROP_PARTS = 'BMA_CROP_PARTS',
  PROCESSING_TYPES = 'PROCESSING_TYPES',
  PROCESSING_METHODS = 'PROCESSING_METHODS',
  CROP_DISEASES = 'CROP_DISEASES',
  CULTIVATION_ACTIVITIES = 'CULTIVATION_ACTIVITIES',
}

export interface Code {
  id: number;
  code: string;
  codeCategoryType?: API_NAMES;
  name: string;
  name_sq: string;
  name_sr: string;
  subCodes?: Code[];
}
