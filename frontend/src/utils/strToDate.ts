export default function strToDate(
  obj: Record<string, unknown>,
  keys: Array<string>,
): void {
  keys.forEach((key) => {
    let value = obj[key];

    if (typeof value === 'string') {
      value = new Date(value);
    }
  });
}

export function toDefaultValues(keys?: Array<string>) {
  return function (data: any) {
    Object.keys(data).forEach((key: string) => {
      if (data[key] === null) {
        data[key] = undefined;
      }
    });

    if (Array.isArray(keys)) {
      keys.forEach((key) => {
        let value = data[key];

        if (typeof value === 'string') {
          value = new Date(value);
        }
      });
    }
  };
}
