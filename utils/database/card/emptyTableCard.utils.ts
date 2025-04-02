import { SQLiteDatabase } from 'expo-sqlite';

export const emptyTableCard = async (database: SQLiteDatabase) => {
  try {
    await database.execAsync('DELETE FROM Card;');
    console.log('table Card emptied');
  } catch (error) {
    console.error(error);
  }
};
