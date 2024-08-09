export const formatArea = (
  amount: number,
  unit: 'hectare' | 'square-meter' = 'hectare',
) => {
  const translatedUnit = unit === 'square-meter' ? 'meter' : unit;

  const result = new Intl.NumberFormat('sq-AL', {
    style: 'unit',
    unit: translatedUnit,
  }).format(amount);

  return unit === 'square-meter' ? result.replace('m', 'm²') : result;
};
