export function len(arg: any): number {
  const invalidTypes = ['boolean', 'symbol', 'function', 'undefined'];

  if (invalidTypes.includes(typeof arg)) {
    return 0;
  }

  if (Array.isArray(arg) || typeof arg === 'string') {
    return arg.length;
  }

  if (typeof arg === 'object') {
    return Object.keys(arg).length;
  }

  return arg;
}
