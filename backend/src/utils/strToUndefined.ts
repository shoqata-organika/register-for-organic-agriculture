export default function strToUndefined<T>(item: T): T {
  return Object.entries(item).reduce((data, [key, value]: [string, any]) => {
    // formData converts every value to string if they are not string or blobs
    // so we convert 'undefined' to undefined in order to save it as null in db
    if (value === 'undefined') {
      value = undefined;
    } else if (value === 'null') {
      value = null;
    }

    return { ...data, [key]: value };
  }, {}) as T;
}
