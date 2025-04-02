import { SQLiteDatabase } from 'expo-sqlite';

export const createDeck = (database: SQLiteDatabase, deckName: string) => {
  try {
    database.runAsync('INSERT INTO Deck (name) VALUES (?);', [deckName]);
    console.log('Nouveau deck', deckName, 'ajouté');
  } catch (error) {
    console.error(error);
  }
};
