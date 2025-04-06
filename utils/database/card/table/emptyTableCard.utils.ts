import { SQLiteDatabase } from 'expo-sqlite';

export const emptyTableCard = async (database: SQLiteDatabase) => {
  try {
    await database.execAsync('DELETE FROM Card;');
  } catch (error) {
    console.error(error);
  }
};
