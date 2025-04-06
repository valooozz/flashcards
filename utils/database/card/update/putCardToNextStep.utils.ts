import { SQLiteDatabase } from 'expo-sqlite';
import { getNextRevision } from '../../../getNextRevision.utils';
import { getNextSide } from '../../../getNextSide.utils';
import { getNextStep } from '../../../getNextStep.utils';

export const putCardToNextStep = async (
  database: SQLiteDatabase,
  id: number,
  step: number,
  rectoFirst: number,
  changeSide: number,
) => {
  try {
    const nextStep = getNextStep(step);
    const nextRevision = getNextRevision(nextStep);
    const nextSide = getNextSide(rectoFirst, changeSide);

    database.runAsync(
      'UPDATE Card SET step=?, nextRevision=?, rectoFirst=? WHERE id=?',
      [nextStep, nextRevision, nextSide, id],
    );
  } catch (error) {
    console.error(error);
  }
};
