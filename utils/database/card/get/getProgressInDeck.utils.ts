import { SQLiteDatabase } from 'expo-sqlite';

export const getProgressInDeck = async (
  database: SQLiteDatabase,
  idDeck: number,
): Promise<number> => {
  let result: object = undefined;
  try {
    result = await database.getFirstAsync(
      'SELECT SUM(step), COUNT(*) FROM Card WHERE deck=?',
      [idDeck],
    );
  } catch (error) {
    console.error(error);
  }

  return (result['SUM(step)'] / (result['COUNT(*)'] * 8)) * 100;
};
