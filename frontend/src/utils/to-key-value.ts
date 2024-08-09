function toKeyValue<T>(
  arr: T[],
  getKey: (obj: T) => number,
  getValue: (obj: T) => string,
): { [key: number]: string } {
  return arr
    .map((obj) => [getKey(obj), getValue(obj)])
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
}

export default toKeyValue;
