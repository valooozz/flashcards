import { SQLiteDatabase } from 'expo-sqlite';

export const resetAllCards = (database: SQLiteDatabase) => {
  try {
    database.runAsync('UPDATE Card SET nextRevision=NULL');
    console.log('Reset All Cards');
  } catch (error) {
    console.error(error);
  }
};
