export const getDate = (n: number): string => {
  const day = new Date();
  day.setDate(day.getDate() + n);
  return day.toISOString().split('T')[0];
};
