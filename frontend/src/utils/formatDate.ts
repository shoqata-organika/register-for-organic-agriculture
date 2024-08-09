import { format } from 'date-fns/esm';

export function formatDate(date?: Date | string): string {
  if (!date) {
    return '';
  }

  if (typeof date === 'string') {
    date = new Date(date);
  }

  const result = format(date, 'dd.MM.yyyy');

  return result;
}
