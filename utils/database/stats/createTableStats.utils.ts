import { SQLiteDatabase } from 'expo-sqlite';

export const createTableStats = async (database: SQLiteDatabase) => {
  try {
    await database.execAsync(
      'CREATE TABLE IF NOT EXISTS Stats (date TEXT PRIMARY KEY, nbKnown INTEGER, nbForgotten INTEGER, nbLearnt INTEGER);',
    );
  } catch (error) {
    console.error(error);
  }
};
