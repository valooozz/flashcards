import { SQLiteDatabase } from 'expo-sqlite';

export const cancelLastActionOnCard = async (
  database: SQLiteDatabase,
  id: number,
  step: number,
  nextRevision: string,
  rectoFirst: number,
) => {
  try {
    database.runAsync(
      'UPDATE Card SET step=?, nextRevision=?, rectoFirst=?, toLearn=1 WHERE id=?',
      [step, nextRevision, rectoFirst, id],
    );
  } catch (error) {
    console.error(error);
  }
};
