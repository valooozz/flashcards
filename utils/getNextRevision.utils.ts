import { getDate } from './getDate.utils';

export const getNextRevision = (intervals: number[], step: number): string => {
  const nextInterval = intervals[step];
  const nextRevision = getDate(nextInterval);

  return nextRevision;
};
