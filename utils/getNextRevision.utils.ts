import { getDate } from './getDate.utils';

export const getNextRevision = (step: number): string => {
  const intervals = [1, 2, 4, 7, 14, 30, 30, 30, 60];
  const nextInterval = intervals[step];
  const nextRevision = getDate(nextInterval);

  return nextRevision;
};
