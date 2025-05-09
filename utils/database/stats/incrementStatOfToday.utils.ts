import { SQLiteDatabase } from 'expo-sqlite';
import { getDate } from '../../getDate.utils';

export const incrementStatOfToday = async (
  database: SQLiteDatabase,
  column: string,
) => {
  const today = getDate(0);
  try {
    await database.runAsync(
      `UPDATE Stats SET ${column} = ${column} + 1 WHERE date=?;`,
      [today],
    );
  } catch (error) {
    console.error(error);
  }
};
