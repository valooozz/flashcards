export const getProgressBarLength = (step: number) => {
  if (step === 0) {
    return 0;
  }
  return 100 / (9 - step);
};
