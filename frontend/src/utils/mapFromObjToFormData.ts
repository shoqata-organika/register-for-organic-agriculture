export function mapFromObjToFormData(obj: any): FormData {
  const data = Object.entries(obj).reduce(
    (data, [key, value]: [string, any]) => {
      if (typeof value === 'string' && !value) {
        value = undefined;
      } else if (
        typeof value === 'string' ||
        typeof value === 'undefined' ||
        value instanceof File
      ) {
        value = value;
      } else if (value instanceof Date) {
        value = value?.toString();
      } else if (typeof value === 'object' && value !== null) {
        value = JSON.stringify(value);
      } else if (value !== null && value !== undefined) {
        value = value?.toString();
      }

      data.append(key, value);

      return data;
    },
    new FormData(),
  );

  return data;
}
