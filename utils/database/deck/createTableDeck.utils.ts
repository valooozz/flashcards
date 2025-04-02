import { SQLiteDatabase } from 'expo-sqlite';

export const createTableDeck = async (database: SQLiteDatabase) => {
  try {
    await database.execAsync(
      'CREATE TABLE IF NOT EXISTS Deck (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE);',
    );
    console.log('table Deck created');
  } catch (error) {
    console.error(error);
  }
};
