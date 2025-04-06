import { SQLiteDatabase } from 'expo-sqlite';

export const createDeck = (database: SQLiteDatabase, deckName: string) => {
  try {
    database.runAsync('INSERT INTO Deck (name) VALUES (?);', [deckName]);
  } catch (error) {
    console.error(error);
  }
};
