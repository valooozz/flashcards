import { SQLiteDatabase } from 'expo-sqlite';

export const dropTableCard = async (database: SQLiteDatabase) => {
  try {
    await database.execAsync('DROP TABLE Card;');
  } catch (error) {
    console.error(error);
  }
};
