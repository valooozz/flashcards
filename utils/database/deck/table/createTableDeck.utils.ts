import { SQLiteDatabase } from 'expo-sqlite';

export const createTableDeck = async (database: SQLiteDatabase) => {
  try {
    await database.execAsync(
      `CREATE TABLE IF NOT EXISTS Deck (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        changeSide INTEGER NOT NULL,
        showName INTEGER NOT NULL,
      );`,
    );
  } catch (error) {
    console.error(error);
  }
};
