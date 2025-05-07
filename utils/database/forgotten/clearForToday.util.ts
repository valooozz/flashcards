import { SQLiteDatabase } from 'expo-sqlite';
import { getDate } from '../../getDate.utils';

export const clearForToday = async (
  database: SQLiteDatabase,
): Promise<boolean> => {
  const today = getDate(0);

  return database
    .runAsync('DELETE FROM Forgotten WHERE date < ?', [today])
    .then(() => true)
    .catch(() => false);
};
