import { SQLiteDatabase } from 'expo-sqlite';
import { getDate } from '../../../getDate.utils';

export const putCardToReviseTommorow = async (
  database: SQLiteDatabase,
  id: number,
) => {
  try {
    const tomorrow = getDate(1);

    database.runAsync('UPDATE Card SET step=?, nextRevision=? WHERE id=?', [
      0,
      tomorrow,
      id,
    ]);
  } catch (error) {
    console.error(error);
  }
};
