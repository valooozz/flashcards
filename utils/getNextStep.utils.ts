export const getNextStep = (currentStep: number): number => {
  if (currentStep >= 8) {
    return 8;
  }
  return currentStep + 1;
};
