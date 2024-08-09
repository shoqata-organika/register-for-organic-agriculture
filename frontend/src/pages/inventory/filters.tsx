import { InventoryItem } from '@/api/types/inventory';

export interface Filters {
  crop?: string;
  from_date?: Date;
  to_date?: Date;
  admission?: string;
}

export const filterState = (): Filters => ({
  crop: undefined,
  from_date: undefined,
  to_date: undefined,
  admission: undefined,
});

export function filterBy(type: keyof Filters, val?: any, locale?: string) {
  return (array: InventoryItem[]): InventoryItem[] => {
    if (!array.length) return [];

    if (!val) return array;

    switch (type) {
      case 'from_date': {
        const filterDate = new Date(val).getTime();

        return array.filter((item) => {
          return new Date(item.date).getTime() >= filterDate;
        });
      }

      case 'to_date': {
        const filterDate = new Date(val).getTime();

        return array.filter((item) => {
          return new Date(item.date).getTime() <= filterDate;
        });
      }

      case 'crop': {
        if (!locale) {
          throw new Error(
            'Please specify the language when you try to filter threw items that might be tranlsated to other languages',
          );
        }

        return array.filter((item) => {
          if (!item.crop) return item;

          return item.crop[`name_${locale}` as keyof typeof item.crop] === val;
        });
      }

      case 'admission': {
        return array.filter((item) => {
          if (!item.admissionEntry.admission) return item;

          return item.admissionEntry.admission.admission_no === val;
        });
      }

      default:
        return array;
    }
  };
}
