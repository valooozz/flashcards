export const getPreviousStep = (currentStep: number): number => {
  if (currentStep <= 0) {
    return 0;
  }
  return currentStep - 1;
};
