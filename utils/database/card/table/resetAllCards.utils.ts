import { SQLiteDatabase } from 'expo-sqlite';

export const resetAllCards = (database: SQLiteDatabase) => {
  try {
    database.runAsync('UPDATE Card SET nextRevision=NULL');
  } catch (error) {
    console.error(error);
  }
};
