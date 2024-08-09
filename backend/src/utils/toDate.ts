export function toDate<T>(item: T, keys: Array<string>): void {
  keys.forEach((key) => {
    if (item[key]) {
      item[key] = new Date(item[key]);
    }
  });
}
