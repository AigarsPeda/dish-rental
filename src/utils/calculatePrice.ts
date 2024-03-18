export const calculateDaysBetween = (startDate: Date, endDate: Date) => {
  const diffTime = Math.abs(endDate?.getTime() - startDate?.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

export const calculatePrice = (
  price: number | undefined,
  amount: number,
  startDate: Date,
  endDate: Date,
) => {
  if (!price) return 0;

  const diffDays = calculateDaysBetween(startDate, endDate);

  // round to 2 decimal places
  return Math.round(price * amount * diffDays * 100) / 100;
};
