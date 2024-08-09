export const formatMoney = (amount: number) => {
  return new Intl.NumberFormat('sq-AL', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};
