export const CropStates = {
  Dry: 'dry' as const,
  Fresh: 'fresh' as const,
} as const;

export const CropStatuses = {
  Organic: 'organic' as const,
  Conventional: 'conventional' as const,
  K1: 'k1' as const,
  K2: 'k2' as const,
  K3: 'k3' as const,
} as const;

export type CropState = (typeof CropStates)[keyof typeof CropStates];
export type CropStatus = (typeof CropStatuses)[keyof typeof CropStatuses];
