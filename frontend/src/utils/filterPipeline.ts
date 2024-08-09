export function filterPipeline<T>(...pipes: Array<(items: T[]) => T[]>) {
  return (array: T[]): T[] => {
    let accumulator: T[] = array;

    for (let i = 0; i < pipes.length; i++) {
      const fn = pipes[i];

      accumulator = fn(accumulator);
    }

    return accumulator;
  };
}
