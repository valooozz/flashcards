import { SQLiteDatabase } from 'expo-sqlite';

export const createDeck = async (
  database: SQLiteDatabase,
  deckName: string,
): Promise<boolean> => {
  return database
    .runAsync('INSERT INTO Deck (name) VALUES (?);', [deckName])
    .then(() => true)
    .catch(() => false);
};
