export const getDelay = (givenDate: string): number => {
  const revisionDate = new Date(givenDate);
  const today = new Date();
  const differenceInTime = today.getTime() - revisionDate.getTime();
  const differenceInDays = differenceInTime / (1000 * 3600 * 24);

  return Math.floor(differenceInDays);
};
