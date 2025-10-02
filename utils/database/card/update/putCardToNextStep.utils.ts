import { SQLiteDatabase } from 'expo-sqlite';
import { getNextRevision } from '../../../getNextRevision.utils';
import { getNextSide } from '../../../getNextSide.utils';
import { getNextStep } from '../../../getNextStep.utils';

export const putCardToNextStep = async (
  database: SQLiteDatabase,
  intervals: number[],
  id: number,
  step: number,
  rectoFirst: number,
  changeSide: number,
  stopLearning: boolean,
) => {
  try {
    const nextStep = getNextStep(step);
    const nextRevision = getNextRevision(intervals, nextStep);
    const nextSide = getNextSide(rectoFirst, changeSide);
    const toLearn = step === 8 && stopLearning ? 0 : 1;

    database.runAsync(
      'UPDATE Card SET step=?, nextRevision=?, rectoFirst=?, toLearn=? WHERE id=?',
      [nextStep, nextRevision, nextSide, toLearn, id],
    );
  } catch (error) {
    console.error('putCardToNextStep:', error);
  }
};
