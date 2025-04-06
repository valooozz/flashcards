export const getNextSide = (
  currentSide: number,
  changeSide: number,
): number => {
  if (changeSide) {
    return (currentSide + 1) % 2;
  }
  return currentSide;
};
