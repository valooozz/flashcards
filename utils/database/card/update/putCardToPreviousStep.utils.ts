import { SQLiteDatabase } from 'expo-sqlite';
import { getNextRevision } from '../../../getNextRevision.utils';
import { getNextSide } from '../../../getNextSide.utils';
import { getPreviousStep } from '../../../getPreviousStep.utils';

export const putCardToPreviousStep = async (
  database: SQLiteDatabase,
  intervals: number[],
  id: number,
  step: number,
  rectoFirst: number,
  changeSide: number,
) => {
  try {
    const previousStep = getPreviousStep(step);
    const nextRevision = getNextRevision(intervals, previousStep);
    const nextSide = getNextSide(rectoFirst, changeSide);

    database.runAsync(
      'UPDATE Card SET step=?, nextRevision=?, rectoFirst=? WHERE id=?',
      [previousStep, nextRevision, nextSide, id],
    );
  } catch (error) {
    console.error(error);
  }
};
