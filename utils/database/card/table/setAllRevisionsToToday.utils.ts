import { SQLiteDatabase } from 'expo-sqlite';
import { getDate } from '../../../getDate.utils';

export const setAllRevisionsToToday = (database: SQLiteDatabase) => {
  const today = getDate(0);
  try {
    database.runAsync('UPDATE Card SET nextRevision=?', [today]);
  } catch (error) {
    console.error(error);
  }
};
