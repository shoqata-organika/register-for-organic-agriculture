import { clsx, type ClassValue } from 'clsx';
import * as z from 'zod';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type DropdownItems = {
  value: number | string;
  label: string;
};

export function unique(array: Array<DropdownItems>): Array<DropdownItems> {
  const uniqueArray: Array<DropdownItems> = [];
  const _ids: Array<number | string> = [];
  let index = 0;

  while (index < array.length) {
    const item = array[index];
    index++;

    if (!_ids.includes(item.value)) {
      _ids.push(item.value);
      uniqueArray.push(item);
    }
  }

  return uniqueArray;
}

export function geoSuperRefinement(val: number, ctx: z.RefinementCtx) {
  if (val && +val >= 100) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Number provided is to large, should be below 100',
    });
  }
}

export function getTotal<T>(
  items: Array<T>,
  getProp: (item: T) => number | string | null | undefined,
): string {
  return items
    .reduce((sum, item) => {
      try {
        const value = Number(getProp(item)) ?? 0;

        return (sum += value);
      } catch (error) {
        return sum;
      }
    }, 0)
    .toFixed(2);
}
