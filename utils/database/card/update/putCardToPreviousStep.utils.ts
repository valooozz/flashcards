import { SQLiteDatabase } from 'expo-sqlite';
import { getNextRevision } from '../../../getNextRevision.utils';
import { getPreviousStep } from '../../../getPreviousStep.utils';

export const putCardToPreviousStep = async (
  database: SQLiteDatabase,
  intervals: number[],
  id: number,
  step: number,
) => {
  try {
    const previousStep = getPreviousStep(step);
    const nextRevision = getNextRevision(intervals, previousStep);

    database.runAsync('UPDATE Card SET step=?, nextRevision=? WHERE id=?', [
      previousStep,
      nextRevision,
      id,
    ]);
  } catch (error) {
    console.error(error);
  }
};
